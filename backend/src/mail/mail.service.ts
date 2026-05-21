import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendTicketEmail(data: {
    to: string;
    fullName: string;
    eventTitle: string;
    qrCode: string;
  }) {
    return this.transporter.sendMail({
      from: `"Uniquo" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
      to: data.to,
      subject: `Il tuo ticket per ${data.eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h1>Il tuo ticket Uniquo</h1>
          <p>Ciao ${data.fullName},</p>
          <p>Il tuo biglietto per <strong>${data.eventTitle}</strong> è stato generato con successo.</p>
          <p><strong>Codice QR:</strong></p>
          <p style="font-size: 14px; background: #f4f4f4; padding: 16px; border-radius: 12px;">
            ${data.qrCode}
          </p>
          <p>Presenta questo codice all'ingresso per effettuare il check-in.</p>
          <br />
          <p>Grazie,<br />Uniquo</p>
        </div>
      `,
    });
  }
}