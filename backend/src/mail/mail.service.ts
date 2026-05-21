import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend(
    process.env.RESEND_API_KEY,
  );

  async sendTicketEmail(data: {
    to: string;
    fullName: string;
    qrCode: string;
    eventTitle: string;
  }) {
    try {
      await this.resend.emails.send({
        from:
          process.env.MAIL_FROM ||
          'no-reply@uniquo.it',
        to: data.to,
        subject: `Biglietto ${data.eventTitle}`,
        html: `
          <div style="font-family:Arial;padding:20px;">
            <h1>🎟️ Ticket confermato</h1>
            <p>Ciao ${data.fullName},</p>
            <p>Il tuo ticket per <strong>${data.eventTitle}</strong> è stato creato.</p>
            <p><strong>QR Code:</strong></p>
            <div style="padding:12px;background:#f5f5f5;border-radius:12px;word-break:break-all;font-family:monospace;">
              ${data.qrCode}
            </div>
            <p style="margin-top:20px;">Team Uniquo</p>
          </div>
        `,
      });

      console.log('Email inviata');
    } catch (error) {
      console.error('Email error:', error);
    }
  }
}