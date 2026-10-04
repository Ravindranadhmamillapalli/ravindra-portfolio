type SendOtpResult = { delivered: boolean };

export async function sendOtpEmail(
  email: string,
  otp: string,
): Promise<SendOtpResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { delivered: false };

  const from =
    process.env.OTP_FROM_EMAIL ??
    "Ravindra Portfolio <noreply@example.com>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your login code",
      text: `Your Firebase login code is ${otp}. It expires in 10 minutes.`,
    }),
  });

  if (!response.ok) {
    throw new Error("Could not send the verification email.");
  }

  return { delivered: true };
}
