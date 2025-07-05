import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { BookingDto } from '../../bookings/dto/booking.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.pass'),
      },
    });
  }

  async sendBookingConfirmation(email: string, booking: BookingDto, eTicket: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('email.user'),
      to: email,
      subject: `Booking Confirmation - ${booking.bookingReference}`,
      html: this.generateBookingConfirmationEmail(booking, eTicket),
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendBookingUpdate(email: string, booking: BookingDto): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('email.user'),
      to: email,
      subject: `Booking Update - ${booking.bookingReference}`,
      html: this.generateBookingUpdateEmail(booking),
    };

    await this.transporter.sendMail(mailOptions);
  }

  private generateBookingConfirmationEmail(booking: BookingDto, eTicket: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Booking Confirmation</h2>
        <p>Dear Passenger,</p>
        <p>Your flight booking has been confirmed successfully!</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Booking Details</h3>
          <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
          <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
          <p><strong>Cabin Class:</strong> ${booking.cabinClass}</p>
        </div>

        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>E-Ticket</h3>
          <p>Your e-ticket number: <strong>${eTicket}</strong></p>
        </div>

        <p>Thank you for choosing our airline!</p>
      </div>
    `;
  }

  private generateBookingUpdateEmail(booking: BookingDto): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Booking Update</h2>
        <p>Dear Passenger,</p>
        <p>Your flight booking has been updated.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Updated Booking Details</h3>
          <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
          <p><strong>New Status:</strong> ${booking.status}</p>
          <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
        </div>

        <p>If you have any questions, please contact our customer service.</p>
      </div>
    `;
  }
} 