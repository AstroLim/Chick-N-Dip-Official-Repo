import { supabase } from "../utils/supabase/client";
import * as inquiryRepo from "../repositories/inquiry.repo";
import * as msgRepo from "../repositories/inquiryMessage.repo";
import * as accountRepo from "../repositories/account.repo";

/**
 * Helpers
 */

const MAX_SUBJECT = 120;
const MAX_BODY = 2000;

function cleanText(s) {
  return (s ?? "").toString().trim();
}

function assertLen(label, value, min, max) {
  const n = value.length;
  if (n < min || n > max) throw new Error(`${label} must be between ${min}-${max} characters.`);
}

/**
 * Reads the current auth user from client session.
 * Use this inside client components only.
 */
export async function getCurrentUserIdOrThrow() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const uid = data?.user?.id;
  if (!uid) throw new Error("Not authenticated.");
  return uid;
}

/**
 * Create inquiry + initial message (ticketing behavior)
 * subject goes in inquiries table, body goes in inquiry_messages table
 */
export async function createInquiryWithMessage({ subject, body }) {
  const userId = await getCurrentUserIdOrThrow();

  const cleanSubject = cleanText(subject);
  const cleanBody = cleanText(body);

  assertLen("Subject", cleanSubject, 1, MAX_SUBJECT);
  assertLen("Message", cleanBody, 1, MAX_BODY);

  // Create inquiry first
  const inquiry = await inquiryRepo.createInquiry({
    subject: cleanSubject,
    created_by: userId,
    status: "open",
  });

  // Then create first message
  const message = await msgRepo.createMessage({
    inquiry_id: inquiry.id,
    sender_id: userId,
    sender_type: "user",
    body: cleanBody,
  });

  return { inquiry, message };
}

/**
 * User reply (RLS already enforces: must own inquiry + not closed)
 */
export async function replyToInquiryAsUser({ inquiryId, body }) {
  const userId = await getCurrentUserIdOrThrow();

  const cleanBody = cleanText(body);
  assertLen("Message", cleanBody, 1, MAX_BODY);

  return msgRepo.createMessage({
    inquiry_id: inquiryId,
    sender_id: userId,
    sender_type: "user",
    body: cleanBody,
  });
}

/**
 * Admin reply
 * (RLS should enforce admin; you already have public.is_admin())
 */
export async function replyToInquiryAsAdmin({ inquiryId, body }) {
  const userId = await getCurrentUserIdOrThrow();

  const cleanBody = cleanText(body);
  assertLen("Message", cleanBody, 1, MAX_BODY);

  return msgRepo.createMessage({
    inquiry_id: inquiryId,
    sender_id: userId,
    sender_type: "admin",
    body: cleanBody,
  });
}

/**
 * Fetch inquiry + messages as a thread, with creator profile for email reply
 */
export async function getInquiryThread(inquiryId) {
  const [inquiry, messages] = await Promise.all([
    inquiryRepo.getInquiryById(inquiryId),
    msgRepo.listMessagesByInquiryId(inquiryId),
  ]);

  let creator = null;
  if (inquiry?.created_by) {
    try {
      creator = await accountRepo.getProfileById(inquiry.created_by);
    } catch {
      creator = null;
    }
  }

  return { inquiry, messages, creator };
}

/**
 * User list (their own tickets)
 */
export async function listMyInquiryThreads() {
  const userId = await getCurrentUserIdOrThrow();
  return inquiryRepo.listMyInquiries({ userId });
}

/**
 * Admin list (all tickets)
 */
export async function listAllInquiryThreadsAdmin({ status } = {}) {
  return inquiryRepo.listAllInquiriesAdmin({ status });
}

/**
 * Close inquiry (admin typically; you can allow user if you want)
 */
export async function closeInquiry(inquiryId) {
  return inquiryRepo.updateInquiry(inquiryId, { status: "closed" });
}

/**
 * Soft delete (admin)
 */
export async function adminSoftDeleteInquiry(inquiryId) {
  return inquiryRepo.softDeleteInquiry(inquiryId);
}