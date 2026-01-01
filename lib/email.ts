import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Choose email provider based on environment
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'nodemailer'; // 'nodemailer' or 'resend'

// Nodemailer setup (for SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Resend setup (modern alternative)
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    if (EMAIL_PROVIDER === 'resend' && process.env.RESEND_API_KEY) {
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@realestate.com',
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      });
      return { success: true, messageId: result.data?.id };
    } else {
      // Use nodemailer
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Real Estate Alerts" <noreply@realestate.com>',
        to,
        subject,
        text: text || html.replace(/<[^>]*>/g, ''),
        html,
      });
      return { success: true, messageId: info.messageId };
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

// Email templates
export const emailTemplates = {
  newMatch: (propertyTitle: string, propertyUrl: string, searchName: string) => ({
    subject: `New Property Match: ${propertyTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; }
            .property-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; 
                   text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏡 New Property Match!</h1>
            </div>
            <div class="content">
              <p>Good news! We found a new property that matches your saved search: <strong>${searchName}</strong></p>
              <div class="property-card">
                <h2>${propertyTitle}</h2>
                <a href="${propertyUrl}" class="btn">View Property Details</a>
              </div>
              <p>This property was just listed and matches your search criteria. Check it out before it's gone!</p>
            </div>
            <div class="footer">
              <p>You're receiving this email because you enabled alerts for your saved search.</p>
              <p><a href="${process.env.NEXTAUTH_URL}/profile/alerts">Manage your alerts</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  priceDrop: (
    propertyTitle: string,
    propertyUrl: string,
    oldPrice: number,
    newPrice: number,
    percentDrop: number
  ) => ({
    subject: `🔔 Price Drop Alert: ${propertyTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; }
            .property-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .price-drop { background: #d1fae5; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .old-price { text-decoration: line-through; color: #6b7280; }
            .new-price { color: #10b981; font-size: 24px; font-weight: bold; }
            .savings { color: #059669; font-weight: bold; }
            .btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; 
                   text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Price Drop Alert!</h1>
            </div>
            <div class="content">
              <div class="property-card">
                <h2>${propertyTitle}</h2>
                <div class="price-drop">
                  <p class="old-price">Was: $${oldPrice.toLocaleString()}</p>
                  <p class="new-price">Now: $${newPrice.toLocaleString()}</p>
                  <p class="savings">Save $${(oldPrice - newPrice).toLocaleString()} (${percentDrop}% off!)</p>
                </div>
                <a href="${propertyUrl}" class="btn">View Property Now</a>
              </div>
              <p>This property just had a price reduction. Don't miss this opportunity!</p>
            </div>
            <div class="footer">
              <p>You're receiving this email because you have price alerts enabled.</p>
              <p><a href="${process.env.NEXTAUTH_URL}/profile/alerts">Manage your alerts</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  statusChange: (
    propertyTitle: string,
    propertyUrl: string,
    oldStatus: string,
    newStatus: string
  ) => ({
    subject: `Status Update: ${propertyTitle} is now ${newStatus}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; }
            .property-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .status-change { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .btn { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; 
                   text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📢 Property Status Update</h1>
            </div>
            <div class="content">
              <div class="property-card">
                <h2>${propertyTitle}</h2>
                <div class="status-change">
                  <p>Status changed: <strong>${oldStatus}</strong> → <strong>${newStatus}</strong></p>
                </div>
                <a href="${propertyUrl}" class="btn">View Property Details</a>
              </div>
              ${
                newStatus === 'ACTIVE'
                  ? '<p><strong>Great news!</strong> This property is back on the market. Act fast!</p>'
                  : '<p>This property status has been updated. Check the listing for more details.</p>'
              }
            </div>
            <div class="footer">
              <p>You're receiving this email because you have status alerts enabled.</p>
              <p><a href="${process.env.NEXTAUTH_URL}/profile/alerts">Manage your alerts</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  dailyDigest: (matches: Array<{ title: string; url: string; type: string }>, searchName: string) => ({
    subject: `Daily Digest: ${matches.length} new alert(s) for ${searchName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366f1; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; }
            .alert-item { background: white; padding: 15px; border-radius: 6px; margin: 10px 0; 
                          border-left: 4px solid #6366f1; }
            .btn { display: inline-block; background: #6366f1; color: white; padding: 10px 20px; 
                   text-decoration: none; border-radius: 6px; margin: 5px 0; font-size: 14px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Your Daily Property Digest</h1>
            </div>
            <div class="content">
              <p>Here's your daily summary for: <strong>${searchName}</strong></p>
              ${matches
                .map(
                  (match) => `
                <div class="alert-item">
                  <p><strong>${match.type}</strong></p>
                  <h3>${match.title}</h3>
                  <a href="${match.url}" class="btn">View Details</a>
                </div>
              `
                )
                .join('')}
            </div>
            <div class="footer">
              <p>You're receiving this daily digest for your saved searches.</p>
              <p><a href="${process.env.NEXTAUTH_URL}/profile/alerts">Manage your alerts</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
