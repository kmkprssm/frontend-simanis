import Image from "next/image";

import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";
import Logo from "@/public/riskrssmMMMM.png";
import CONST from "@/lib/constants";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk untuk mengelola manajemen risiko Anda.",
};

const LoginPage = () => {
  const APP_BASE_PATH = CONST.APP_BASE_PATH;

  return (
    <div
      className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat p-6 md:p-10"
      style={{ backgroundImage: `url("${APP_BASE_PATH}/logomanrisk.webp")` }}
    >
      <div className="bg-manrisk-overlay absolute top-0 right-0 bottom-0 left-0 z-[calc(var(--index)+1)]" />
      <div className="relative z-[calc(var(--index)+2)] flex w-full max-w-sm flex-col gap-4 md:max-w-4xl">
        <div className="flex items-center gap-1 self-center text-2xl font-bold text-white md:text-4xl">
          <div className="flex items-center justify-center">
            <Image
              src={Logo}
              alt="Logo Manrisk"
              width={80}
              height={80}
              priority
            />
          </div>
          SiManis RSSM
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
