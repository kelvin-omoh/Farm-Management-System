import { NextRequest, NextResponse } from "next/server";
import Order from "../../models/Order";
import { initMongoose } from "@/app/lib/mongoose";

export const POST = async (req) => {
    const { name, email, orderDetails } = await req.json();
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: 'enaikeleomoh@gmail.com', // Your email
            pass: 'kelvinomoh', // Your email password
        },
    });
    // Email content
    let mailOptions = {
        from: 'enaikeleomoh@gmail.com', // Sender address
        to: email, // List of recipients
        subject: 'Order Confirmation - YourApp', // Subject line
        text: `Dear ${name},\n\nThank you for your purchase from YourApp! Here are the details of your order:\n\n${orderDetails.map(product => `${product.name} (x${product.quantity})`).join('\n')}\n\nTotal: ₦${orderDetails.total}\n\nWe appreciate your business and hope to see you again soon!\n\nJoin our waitlist for updates on our app: [waitlist link]\n\nBest regards,\nYourApp Team`,
    };
    try {
        // Send email
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        return NextResponse({ error: 'Failed to send email' });

    }
}