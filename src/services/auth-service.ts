export type AuthIntent = "customer" | "provider";
export type OtpChannel = "sms" | "whatsapp";

type SendOtpResponse = {
  ok: boolean;
  maskedPhone: string;
};

type VerifyOtpResponse = {
  ok: boolean;
  nextPath: string;
  userId: string;
  role: AuthIntent;
};

async function parseApiResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? fallbackMessage);
  }

  return data as T;
}

export async function sendLoginOtp({
  channel,
  intent,
  phone,
}: {
  channel: OtpChannel;
  intent: AuthIntent;
  phone: string;
}) {
  const response = await fetch("/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, intent, channel }),
  });

  return parseApiResponse<SendOtpResponse>(response, "Could not send OTP.");
}

export async function verifyLoginOtp(otp: string) {
  const response = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp }),
  });

  return parseApiResponse<VerifyOtpResponse>(response, "Could not verify OTP.");
}
