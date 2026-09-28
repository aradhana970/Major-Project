import { Resend } from 'resend';

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendTransactionalEmail(payload: EmailPayload) {
  const resend = getResendClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'CampusKart <onboarding@resend.dev>';

  if (!resend) {
    console.log('--------------------------------------------------');
    console.log('[DEV FALLBACK EMAIL LOG]');
    console.log(`From: ${fromEmail}`);
    console.log(`To: ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log('--------------------------------------------------');
    return { success: true, fallback: true, id: 'dev-fallback-id' };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Resend email dispatch error:', error);
    return { success: false, error };
  }
}

// Helper Email Templates
export function getWelcomeEmailTemplate(fullName: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e7ff; border-radius: 8px;">
      <h2 style="color: #4f46e5;">Welcome to CampusKart! 🎓</h2>
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Thank you for registering on CampusKart – the verified student-only marketplace!</p>
      <p>To start selling your textbooks, lab coats, drawing tools, and calculators, please upload your Student ID for quick admin verification.</p>
      <div style="margin: 25px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verification" style="background-color: #4f46e5; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Verify Student ID</a>
      </div>
      <p style="font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 12px;">This project is developed as part of the guidance shared by Prathamesh Sir.</p>
    </div>
  `;
}

export function getVerificationApprovedEmailTemplate(fullName: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #d1fae5; border-radius: 8px;">
      <h2 style="color: #059669;">Student Verification Approved! ✅</h2>
      <p>Great news, <strong>${fullName}</strong>!</p>
      <p>Your student ID document has been reviewed and approved by the campus administrator.</p>
      <p>You can now list items, use AI-assisted product generation, and trade securely with fellow verified students.</p>
      <div style="margin: 25px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products/new" style="background-color: #059669; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">List Your First Item</a>
      </div>
    </div>
  `;
}

export function getVerificationRejectedEmailTemplate(fullName: string, reason: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #fee2e2; border-radius: 8px;">
      <h2 style="color: #dc2626;">Verification Action Needed ⚠️</h2>
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Your recent student verification request was not approved for the following reason:</p>
      <blockquote style="background: #ffe4e6; border-left: 4px solid #dc2626; padding: 10px; margin: 15px 0;">${reason || 'Document was unreadable or expired.'}</blockquote>
      <p>Please log in and upload a clear, unexpired photo of your college ID card.</p>
      <div style="margin: 25px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verification" style="background-color: #dc2626; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Resubmit Verification</a>
      </div>
    </div>
  `;
}

export function getOrderNotificationEmailTemplate(orderNumber: string, itemTitle: string, totalAmount: number, recipientRole: 'buyer' | 'seller') {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e7ff; border-radius: 8px;">
      <h2 style="color: #4f46e5;">Order Update - #${orderNumber} 📦</h2>
      <p>You have a new update regarding your order on CampusKart.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Item:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${itemTitle}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total Amount:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">₹${totalAmount}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Payment / Delivery:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">On-Campus Pickup / COD</td></tr>
      </table>
      <p>${recipientRole === 'seller' ? 'Please log in to your dashboard to review and accept this order.' : 'Check your order status page for campus meeting location details.'}</p>
      <div style="margin: 25px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/orders" style="background-color: #4f46e5; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Order Details</a>
      </div>
    </div>
  `;
}
