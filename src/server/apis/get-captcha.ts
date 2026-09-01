"use server";

import { generateMathCaptcha } from "@/lib/captcha-crypto";

export const getNewCaptcha = async () => {
  const captcha = generateMathCaptcha();
  return captcha;
};
