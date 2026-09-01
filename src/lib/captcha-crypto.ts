import crypto from "crypto";

const CAPTCHA_SECRET =
  process.env.AUTH_SECRET || "fallback-secret-manrisk-1234567890!@#";

export interface CaptchaData {
  question: string;
  token: string;
}

// Fungsi untuk membuat soal matematika acak dan mengenkripsi jawabannya
export function generateMathCaptcha(): CaptchaData {
  const num1 = Math.floor(Math.random() * 9) + 1; // Angka 1-9
  const num2 = Math.floor(Math.random() * 9) + 1; // Angka 1-9
  const answer = num1 + num2;

  const question = `Berapa hasil dari ${num1} + ${num2} ?`;

  // Enkripsi jawaban + timestamp agar token kadaluarsa dalam 5 menit
  const expires = Date.now() + 5 * 60 * 1000;
  const dataToHash = `${answer}:${expires}`;

  const hash = crypto
    .createHmac("sha256", CAPTCHA_SECRET)
    .update(dataToHash)
    .digest("hex");

  // Token akhir berformat hash.waktu_kadaluarsa
  const token = `${hash}.${expires}`;

  return { question, token };
}

// Fungsi untuk memvalidasi jawaban user dengan token yang dikirim balik
export function verifyMathCaptcha(
  userAnswer: string,
  captchaToken: string,
): boolean {
  try {
    const [hash, expires] = captchaToken.split(".");

    if (!hash || !expires) return false;
    if (Date.now() > parseInt(expires)) return false; // Kedaluwarsa

    const dataToHash = `${userAnswer.trim()}:${expires}`;
    const expectedHash = crypto
      .createHmac("sha256", CAPTCHA_SECRET)
      .update(dataToHash)
      .digest("hex");

    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
  } catch {
    return false;
  }
}
