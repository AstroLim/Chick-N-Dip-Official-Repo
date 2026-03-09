"use client";

import { useState } from "react";
import { supabase } from "@/backend/utils/supabase/client";
import * as inquiryService from "@/backend/services/inquiry.service";
import * as inquiryRepo from "@/backend/repositories/inquiry.repo";
import * as inquiryMessageRepo from "@/backend/repositories/inquiryMessage.repo";

export default function InquiryTestPage() {
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [serviceSnapshot, setServiceSnapshot] = useState(null);
  const [repoSnapshot, setRepoSnapshot] = useState(null);

  function push(msg) {
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }

  function safeErr(e) {
    return e?.message || e?.error_description || e?.details || JSON.stringify(e);
  }

  async function loadCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      setCurrentUser(data?.user ?? null);

      if (data?.user) {
        push(`Current auth user loaded. id=${data.user.id} email=${data.user.email || "n/a"}`);
      } else {
        push("No authenticated user found.");
      }

      return data?.user ?? null;
    } catch (e) {
      push(`❌ Failed to load current user: ${safeErr(e)}`);
      throw e;
    }
  }

  async function runUserServiceTest() {
    setBusy(true);
    setLog([]);
    setServiceSnapshot(null);

    let createdInquiryId = null;

    try {
      const user = await loadCurrentUser();
      if (!user?.id) {
        push("❌ User test requires a logged-in account.");
        return;
      }

      push("Running USER service flow test...");

      push("Creating inquiry + first message via createInquiryWithMessage()...");
      const created = await inquiryService.createInquiryWithMessage({
        subject: `TEST USER INQUIRY ${Date.now()}`,
        body: "Initial user test message.",
      });

      createdInquiryId = created?.inquiry?.id;
      push(`✅ Inquiry created. inquiry.id=${createdInquiryId}`);
      push(`✅ First message created. message.id=${created?.message?.id}`);

      push("Listing my inquiry threads via listMyInquiryThreads()...");
      const mine = await inquiryService.listMyInquiryThreads();
      push(`✅ My inquiries loaded. count=${mine?.length ?? 0}`);

      const foundMine = (mine || []).find((x) => x.id === createdInquiryId);
      if (foundMine) {
        push("✅ Newly created inquiry found in my list.");
      } else {
        push("⚠️ Newly created inquiry NOT found in my list.");
      }

      push("Fetching thread via getInquiryThread()...");
      const thread1 = await inquiryService.getInquiryThread(createdInquiryId);
      push(`✅ Thread loaded. messages=${thread1?.messages?.length ?? 0}`);

      push("Replying as user via replyToInquiryAsUser()...");
      const reply = await inquiryService.replyToInquiryAsUser({
        inquiryId: createdInquiryId,
        body: "Second message from user test flow.",
      });
      push(`✅ User reply created. message.id=${reply?.id}`);

      push("Fetching thread again to verify appended message...");
      const thread2 = await inquiryService.getInquiryThread(createdInquiryId);
      push(`✅ Thread reloaded. messages=${thread2?.messages?.length ?? 0}`);

      const userMsgs = (thread2?.messages || []).filter((m) => m.sender_type === "user");
      push(`✅ User sender_type count=${userMsgs.length}`);

      push("Attempting admin-only list via listAllInquiryThreadsAdmin()...");
      try {
        const adminList = await inquiryService.listAllInquiryThreadsAdmin({});
        push(`⚠️ Admin list unexpectedly succeeded as current account. count=${adminList?.length ?? 0}`);
      } catch (e) {
        push(`✅ Admin list blocked as expected for normal user (if this is a user account): ${safeErr(e)}`);
      }

      push("Attempting admin reply via replyToInquiryAsAdmin()...");
      try {
        const adminReply = await inquiryService.replyToInquiryAsAdmin({
          inquiryId: createdInquiryId,
          body: "This should fail for a normal user account.",
        });
        push(`⚠️ Admin reply unexpectedly succeeded. id=${adminReply?.id}`);
      } catch (e) {
        push(`✅ Admin reply blocked as expected for normal user: ${safeErr(e)}`);
      }

      push("Attempting closeInquiry()...");
      try {
        const closed = await inquiryService.closeInquiry(createdInquiryId);
        push(`⚠️ closeInquiry succeeded. status=${closed?.status}`);
      } catch (e) {
        push(`✅ closeInquiry blocked as expected for normal user (if admin-only by RLS): ${safeErr(e)}`);
      }

      push("Attempting adminSoftDeleteInquiry()...");
      try {
        const softDeleted = await inquiryService.adminSoftDeleteInquiry(createdInquiryId);
        push(`⚠️ adminSoftDeleteInquiry succeeded. is_deleted=${softDeleted?.is_deleted}`);
      } catch (e) {
        push(`✅ adminSoftDeleteInquiry blocked as expected for normal user: ${safeErr(e)}`);
      }

      const finalThread = await inquiryService.getInquiryThread(createdInquiryId);
      setServiceSnapshot({
        created,
        mine,
        finalThread,
      });

      push("✅ USER service flow test complete.");
    } catch (e) {
      push(`❌ USER service flow test error: ${safeErr(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function runAdminServiceTest() {
    setBusy(true);
    setLog([]);
    setServiceSnapshot(null);

    let createdInquiryId = null;

    try {
      const user = await loadCurrentUser();
      if (!user?.id) {
        push("❌ Admin test requires a logged-in account.");
        return;
      }

      push("Running ADMIN service flow test...");
      push("This should be run while logged in as an admin account.");

      push("Creating inquiry as current account...");
      const created = await inquiryService.createInquiryWithMessage({
        subject: `TEST ADMIN INQUIRY ${Date.now()}`,
        body: "Initial message for admin flow test.",
      });

      createdInquiryId = created?.inquiry?.id;
      push(`✅ Inquiry created. id=${createdInquiryId}`);

      push("Loading all inquiry threads as admin...");
      const adminList1 = await inquiryService.listAllInquiryThreadsAdmin({});
      push(`✅ Admin list loaded. count=${adminList1?.length ?? 0}`);

      push("Replying as admin...");
      const adminReply = await inquiryService.replyToInquiryAsAdmin({
        inquiryId: createdInquiryId,
        body: "Admin response test message.",
      });
      push(`✅ Admin reply created. id=${adminReply?.id}`);

      push("Closing inquiry...");
      const closed = await inquiryService.closeInquiry(createdInquiryId);
      push(`✅ Inquiry closed. status=${closed?.status}`);

      push("Loading closed thread...");
      const threadClosed = await inquiryService.getInquiryThread(createdInquiryId);
      push(`✅ Closed thread loaded. messages=${threadClosed?.messages?.length ?? 0}`);

      push("Soft deleting inquiry as admin...");
      const softDeleted = await inquiryService.adminSoftDeleteInquiry(createdInquiryId);
      push(`✅ Inquiry soft deleted. is_deleted=${softDeleted?.is_deleted}`);

      push("Loading admin list filtered by closed...");
      const adminClosed = await inquiryService.listAllInquiryThreadsAdmin({ status: "closed" });
      push(`✅ Closed inquiry list loaded. count=${adminClosed?.length ?? 0}`);

      setServiceSnapshot({
        created,
        adminList1,
        adminReply,
        closed,
        threadClosed,
        softDeleted,
        adminClosed,
      });

      push("✅ ADMIN service flow test complete.");
    } catch (e) {
      push(`❌ ADMIN service flow test error: ${safeErr(e)}`);
      push("If this should have worked, verify your RLS admin policies.");
    } finally {
      setBusy(false);
    }
  }

  async function runRawRepoTest() {
    setBusy(true);
    setLog([]);
    setRepoSnapshot(null);

    let inquiryId = null;
    let msgId = null;

    try {
      const user = await loadCurrentUser();
      if (!user?.id) {
        push("❌ Raw repo test requires a logged-in account.");
        return;
      }

      push("Running RAW REPO test...");
      push("This validates direct repository calls under current RLS rules.");

      push("Creating inquiry directly via inquiryRepo.createInquiry()...");
      const inquiry = await inquiryRepo.createInquiry({
        subject: `TEST RAW REPO ${Date.now()}`,
        created_by: user.id,
        status: "open",
      });
      inquiryId = inquiry?.id;
      push(`✅ Raw inquiry created. id=${inquiryId}`);

      push("Reading inquiry via inquiryRepo.getInquiryById()...");
      const loadedInquiry = await inquiryRepo.getInquiryById(inquiryId);
      push(`✅ Inquiry loaded. subject=${loadedInquiry?.subject}`);

      push("Listing my inquiries via inquiryRepo.listMyInquiries()...");
      const myList = await inquiryRepo.listMyInquiries({
        userId: user.id,
        limit: 50,
        offset: 0,
      });
      push(`✅ Raw my inquiries loaded. count=${myList?.length ?? 0}`);

      push("Creating message directly via inquiryMessageRepo.createMessage()...");
      const msg = await inquiryMessageRepo.createMessage({
        inquiry_id: inquiryId,
        sender_id: user.id,
        sender_type: "user",
        body: "Raw repo test message",
      });
      msgId = msg?.id;
      push(`✅ Raw message created. id=${msgId}`);

      push("Listing messages via inquiryMessageRepo.listMessagesByInquiryId()...");
      const msgs1 = await inquiryMessageRepo.listMessagesByInquiryId(inquiryId);
      push(`✅ Raw messages loaded. count=${msgs1?.length ?? 0}`);

      push("Updating inquiry via inquiryRepo.updateInquiry()...");
      const updated = await inquiryRepo.updateInquiry(inquiryId, {
        status: "closed",
      });
      push(`✅ Inquiry updated. status=${updated?.status}`);

      push("Trying admin list via inquiryRepo.listAllInquiriesAdmin()...");
      try {
        const allAdmin = await inquiryRepo.listAllInquiriesAdmin({
          limit: 20,
          offset: 0,
        });
        push(`ℹ️ Raw admin list returned count=${allAdmin?.length ?? 0}`);
      } catch (e) {
        push(`ℹ️ Raw admin list blocked by RLS for this account: ${safeErr(e)}`);
      }

      push("Deleting message via inquiryMessageRepo.deleteMessage()...");
      await inquiryMessageRepo.deleteMessage(msgId);
      push("✅ Message deleted.");

      push("Soft deleting inquiry via inquiryRepo.softDeleteInquiry()...");
      const softDeleted = await inquiryRepo.softDeleteInquiry(inquiryId);
      push(`✅ Inquiry soft deleted. is_deleted=${softDeleted?.is_deleted}`);

      push("Hard deleting inquiry via inquiryRepo.hardDeleteInquiry()...");
      try {
        await inquiryRepo.hardDeleteInquiry(inquiryId);
        push("✅ Inquiry hard deleted.");
      } catch (e) {
        push(`ℹ️ Hard delete blocked by RLS / policy: ${safeErr(e)}`);
      }

      const finalMsgs = await inquiryMessageRepo.listMessagesByInquiryId(inquiryId).catch(() => []);
      setRepoSnapshot({
        inquiry,
        loadedInquiry,
        myList,
        msg,
        updated,
        finalMsgs,
      });

      push("✅ RAW REPO test complete.");
    } catch (e) {
      push(`❌ RAW REPO test error: ${safeErr(e)}`);
    } finally {
      setBusy(false);
    }
  }

  async function cleanupTestData() {
    setBusy(true);

    try {
      const user = await loadCurrentUser();
      if (!user?.id) {
        push("❌ Cleanup requires a logged-in account.");
        return;
      }

      push("Starting cleanup...");

      // Admin cleanup path
      try {
        const all = await inquiryRepo.listAllInquiriesAdmin({ limit: 200, offset: 0 });
        const testInquiries = (all || []).filter((x) =>
          typeof x.subject === "string" &&
          (
            x.subject.startsWith("TEST USER INQUIRY") ||
            x.subject.startsWith("TEST ADMIN INQUIRY") ||
            x.subject.startsWith("TEST RAW REPO")
          )
        );

        push(`Found ${testInquiries.length} test inquiries from admin list.`);

        for (const inq of testInquiries) {
          try {
            const msgs = await inquiryMessageRepo.listMessagesByInquiryId(inq.id).catch(() => []);
            for (const m of msgs) {
              try {
                await inquiryMessageRepo.deleteMessage(m.id);
                push(`Deleted message ${m.id}`);
              } catch (_) {}
            }

            try {
              await inquiryRepo.hardDeleteInquiry(inq.id);
              push(`Deleted inquiry ${inq.id}`);
            } catch (e) {
              push(`Could not hard delete inquiry ${inq.id}: ${safeErr(e)}`);
            }
          } catch (e) {
            push(`Cleanup item failed for inquiry ${inq.id}: ${safeErr(e)}`);
          }
        }

        push("✅ Cleanup finished.");
        return;
      } catch (e) {
        push(`Admin cleanup path unavailable for this account: ${safeErr(e)}`);
      }

      // Fallback cleanup path for normal user: just inspect own inquiries
      try {
        const mine = await inquiryRepo.listMyInquiries({
          userId: user.id,
          limit: 200,
          offset: 0,
        });

        const myTests = (mine || []).filter((x) =>
          typeof x.subject === "string" &&
          (
            x.subject.startsWith("TEST USER INQUIRY") ||
            x.subject.startsWith("TEST ADMIN INQUIRY") ||
            x.subject.startsWith("TEST RAW REPO")
          )
        );

        push(`Found ${myTests.length} test inquiries in my list.`);

        for (const inq of myTests) {
          try {
            await inquiryRepo.softDeleteInquiry(inq.id);
            push(`Soft deleted my inquiry ${inq.id}`);
          } catch (e) {
            push(`Could not soft delete my inquiry ${inq.id}: ${safeErr(e)}`);
          }
        }

        push("✅ User-level cleanup attempt finished.");
      } catch (e) {
        push(`❌ Cleanup failed: ${safeErr(e)}`);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1>Inquiry Module Test Panel</h1>
      <p>
        Use this page to validate your latest inquiry repo + service logic.
        Run once as a normal user, then log out and run again as admin.
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <button disabled={busy} onClick={runUserServiceTest} style={{ padding: "10px 14px" }}>
          {busy ? "Running..." : "Run USER Service Test"}
        </button>

        <button disabled={busy} onClick={runAdminServiceTest} style={{ padding: "10px 14px" }}>
          {busy ? "Running..." : "Run ADMIN Service Test"}
        </button>

        <button disabled={busy} onClick={runRawRepoTest} style={{ padding: "10px 14px" }}>
          {busy ? "Running..." : "Run RAW Repo Test"}
        </button>

        <button disabled={busy} onClick={cleanupTestData} style={{ padding: "10px 14px" }}>
          Cleanup Test Data
        </button>
      </div>

      <section style={{ marginTop: 18 }}>
        <h3>Logs</h3>
        <pre
          style={{
            background: "#111",
            color: "#0f0",
            padding: 12,
            borderRadius: 10,
            overflow: "auto",
            minHeight: 220,
          }}
        >
          {log.join("\n")}
        </pre>
      </section>

      {currentUser && (
        <section style={{ marginTop: 18 }}>
          <h3>Current User Snapshot</h3>
          <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 10, overflow: "auto" }}>
            {JSON.stringify(currentUser, null, 2)}
          </pre>
        </section>
      )}

      {serviceSnapshot && (
        <section style={{ marginTop: 18 }}>
          <h3>Service Snapshot</h3>
          <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 10, overflow: "auto" }}>
            {JSON.stringify(serviceSnapshot, null, 2)}
          </pre>
        </section>
      )}

      {repoSnapshot && (
        <section style={{ marginTop: 18 }}>
          <h3>Repo Snapshot</h3>
          <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 10, overflow: "auto" }}>
            {JSON.stringify(repoSnapshot, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}