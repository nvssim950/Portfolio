import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    // Simple Gmail setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.gmail_user,
        pass: process.env.gmail_pass, // App password
      },
    });

    // Send email to yourself
    await transporter.sendMail({
      from: process.env.gmail_user,
      to: "nassimbddm@gmail.com", // Send to yourself
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ message: 'Email sent!' });
  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
