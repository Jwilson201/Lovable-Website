import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().min(5).max(40),
  email: z.string().email().max(200),
  qualification: z.string().min(1).max(200),
  message: z.string().min(1).max(4000),
});


export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ContactSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["RESEND_API_KEY"];
    const to = process.env["CONTACT_TO_EMAIL"];
    const from = process.env["CONTACT_FROM_EMAIL"] ?? "onboarding@resend.dev";

    if (!apiKey || !to) {
      // Email delivery not connected yet: accept the submission and log it so
      // the form can be tested, but nothing is delivered to an inbox.
      console.log("[contact] Submission captured (email not configured):", {
        name: data.name,
        phone: data.phone,
        email: data.email,
        qualification: data.qualification,
        message: data.message,
        receivedAt: new Date().toISOString(),
      });
      return { ok: true as const, delivered: false as const };
    }


    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `New website inquiry from ${data.name}`,
        text: `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nQualifies as: ${data.qualification}\n\n${data.message}`,

      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Resend request failed [${res.status}]: ${body}`);
      throw new Error(`Email send failed [${res.status}]: ${body}`);
    }

    return { ok: true as const };
  });
