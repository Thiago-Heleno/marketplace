import { Resend } from "resend";

// Ensure RESEND_API_KEY is set (it should be loaded via .env.local by Next.js)
if (!process.env.RESEND_API_KEY) {
  // In development, we might want to allow proceeding without a key,
  // but log a warning. In production, this should definitely throw an error.
  console.warn(
    "RESEND_API_KEY environment variable is not set. Email sending will fail. Please check your .env.local file."
  );
  // For now, let's throw to ensure configuration is addressed.
  // throw new Error('RESEND_API_KEY environment variable is required.');
}

// Initialize Resend client. If the key is missing, it might throw an error
// internally or fail silently depending on the Resend library version.
// Adding a check above is safer.
export const resend = new Resend(process.env.RESEND_API_KEY);
