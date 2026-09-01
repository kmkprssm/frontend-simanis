"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconEye,
  IconEyeOff,
  IconLock,
  IconLogin2,
  IconMail,
  IconRefresh,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { LoginSchema, LoginValues } from "@/schemas/auth-schema";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { LoadingButton } from "../ui/loading-button";
import { login } from "@/server/apis/login";
import { getNewCaptcha } from "@/server/apis/get-captcha";
import loginImg from "@/public/login-image.webp";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [passwordShown, setPasswordShown] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const [captchaQuestion, setCaptchaQuestion] = React.useState<string>("");
  const [captchaToken, setCaptchaToken] = React.useState<string>("");
  const [userCaptchaAnswer, setUserCaptchaAnswer] = React.useState<string>("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const reason = searchParams.get("reason");
  const authError = searchParams.get("error");

  React.useEffect(() => {
    if (reason === "expired" || authError === "RefreshAccessTokenError") {
      const timer = setTimeout(() => {
        toast.error("Sesi Anda telah berakhir", {
          description:
            "Silakan masuk kembali untuk melanjutkan aktivitas Anda.",
          duration: 5000,
          position: "top-right",
        });
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [reason, authError]);

  const handleFetchCaptcha = React.useCallback(async () => {
    const data = await getNewCaptcha();
    setCaptchaQuestion(data.question);
    setCaptchaToken(data.token);
    setUserCaptchaAnswer("");
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    async function initCaptcha() {
      const data = await getNewCaptcha();
      if (isMounted) {
        setCaptchaQuestion(data.question);
        setCaptchaToken(data.token);
        setUserCaptchaAnswer("");
      }
    }

    initCaptcha();

    return () => {
      isMounted = false;
    };
  }, []);

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = form;

  const onSubmit = async (values: LoginValues) => {
    if (!userCaptchaAnswer) {
      toast.error("Isi jawaban matematika!");
      return;
    }

    startTransition(() => {
      login(values, callbackUrl, userCaptchaAnswer, captchaToken).then(
        (res) => {
          if (res?.error) {
            toast.error(res.error, { position: "top-right" });
            // Jika gagal, buat soal matematika baru demi keamanan
            handleFetchCaptcha();
          }

          if (res?.success) {
            reset();
            toast.success(res.success, { position: "top-right" });
          }
        },
      );
    });
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-manrisk-glass text-card ring-background/30 overflow-hidden p-0 shadow-2xl backdrop-blur-md">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            id="form-login"
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 md:p-8"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-xl leading-none font-bold md:text-3xl">
                  Selamat datang kembali
                </h1>
                <p className="text-muted text-balance">
                  Login ke akun Anda untuk mengelola manajemen risiko
                </p>
              </div>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <InputGroup className="h-10">
                      <InputGroupInput
                        {...field}
                        id="email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="Masukkan email"
                        autoComplete="off"
                        className="placeholder:text-zinc-200"
                      />
                      <InputGroupAddon>
                        <IconMail stroke={2} className="text-zinc-200" />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <InputGroup className="h-10">
                      <InputGroupInput
                        {...field}
                        id="password"
                        type={passwordShown ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        autoComplete="off"
                        className="placeholder:text-zinc-200"
                      />
                      <InputGroupAddon>
                        <IconLock stroke={2} className="text-zinc-200" />
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <button
                          name="passwordShown"
                          type="button"
                          aria-label="toggle password visibility"
                          onClick={togglePassword}
                        >
                          {passwordShown ? (
                            <IconEye stroke={2} className="text-zinc-200" />
                          ) : (
                            <IconEyeOff stroke={2} className="text-zinc-200" />
                          )}
                          <span className="sr-only">Pasword Shown</span>
                        </button>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <div className="mb-1 flex items-center justify-between">
                  <FieldLabel htmlFor="captcha">Verifikasi Keamanan</FieldLabel>
                  <button
                    type="button"
                    onClick={handleFetchCaptcha}
                    className="flex cursor-pointer items-center gap-1 text-xs text-zinc-300 opacity-80 hover:text-white"
                    title="Ganti soal"
                  >
                    <IconRefresh size={14} /> Ganti Soal
                  </button>
                </div>
                <InputGroup className="h-10">
                  {/* Bagian Pertanyaan Math */}
                  <InputGroupAddon className="border-r border-zinc-700/50 px-3 font-semibold text-white select-none">
                    {captchaQuestion || "Memuat..."}
                  </InputGroupAddon>

                  {/* Bagian Input Jawaban User */}
                  <InputGroupInput
                    id="captcha"
                    type="number"
                    required
                    min={0}
                    placeholder="Isi angka"
                    value={userCaptchaAnswer}
                    onChange={(e) => setUserCaptchaAnswer(e.target.value)}
                    autoComplete="off"
                    className="pl-3 placeholder:text-zinc-300"
                  />
                </InputGroup>
              </Field>
              <Field>
                <LoadingButton
                  type="submit"
                  form="form-login"
                  size="lg"
                  variant="login"
                  loadingType="submit"
                  loading={isPending}
                  className="shadow-manrisk text-white"
                  disabled={!isDirty || !isValid || !userCaptchaAnswer}
                >
                  Login
                  <IconLogin2 stroke={2} />
                </LoadingButton>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden h-auto w-full md:block">
            <Image
              priority
              src={loginImg}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.2] dark:grayscale"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
