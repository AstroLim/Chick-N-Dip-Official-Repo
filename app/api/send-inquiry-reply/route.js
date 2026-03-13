import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/backend/utils/supabase/server";

export async function POST(request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured. Add RESEND_API_KEY to .env.local" },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const { inquiryId, replyBody, to: toOverride } = body;

    if (!replyBody) {
      return NextResponse.json({ error: "Missing replyBody" }, { status: 400 });
    }

    let to = toOverride;
    let inquirySubject = "Your inquiry";

    if (!to && inquiryId) {
      const supabase = createServerSupabase();
      const { data: inquiry, error: inqErr } = await supabase
        .from("inquiries")
        .select("created_by, subject")
        .eq("id", inquiryId)
        .single();
      if (inqErr || !inquiry) {
        return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
      }
      inquirySubject = inquiry.subject || inquirySubject;
      const { data: authData, error: authErr } = await supabase.auth.admin.getUserById(inquiry.created_by);
      if (authErr || !authData?.user?.email) {
        return NextResponse.json(
          { error: "Could not find user email. Ensure SUPABASE_SERVICE_ROLE_KEY is set." },
          { status: 404 }
        );
      }
      to = authData.user.email;
    }

    if (!to) {
      return NextResponse.json({ error: "Could not determine recipient email" }, { status: 400 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "Chick N' Dip <onboarding@resend.dev>";
    const emailSubject = `Re: ${inquirySubject}`;

    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D41A1A;">Chick N' Dip</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          We've received your inquiry and our team has responded:
        </p>
        <div style="background: #f5f5f5; padding: 1.25rem; border-radius: 12px; margin: 1.5rem 0; white-space: pre-wrap;">${String(replyBody).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        <p style="font-size: 14px; color: #666;">
          You can log in to your account to view the full conversation and reply.
        </p>
        <p style="font-size: 12px; color: #999; margin-top: 2rem;">
          Chick N' Dip &bull; Tarlac City, Philippines
        </p>
      </div>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: emailSubject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Send inquiry reply error:", err);
    return NextResponse.json({ error: err?.message || "Failed to send email" }, { status: 500 });
  }
}
