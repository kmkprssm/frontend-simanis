"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { RegisterUserSchema, RegisterUserValues } from "@/schemas/users-schema";
import { registerUser } from "@/server/apis/users";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { LoadingButton } from "../ui/loading-button";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MasterUsersFormProps {
  onSubmitSuccess: () => void;
}

const ROLE_OPTIONS = [
  { label: "Administrator", value: "ADMIN" },
  { label: "User Standard", value: "USER" },
  { label: "Guest / Tamu", value: "GUEST" },
];

export const MasterUsersForm = ({ onSubmitSuccess }: MasterUsersFormProps) => {
  const [passwordShown, setPasswordShown] = React.useState(false);

  const form = useForm<RegisterUserValues>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { isDirty, isValid, isSubmitting },
  } = form;

  const watchName = watch("name", "");
  const watchPassword = watch("password", "");

  const isNameValid = watchName.length > 0 && /^[a-zA-Z\s]+$/.test(watchName);
  const passwordValidation = {
    length: watchPassword.length >= 8,
    uppercase: /[A-Z]/.test(watchPassword),
    lowercase: /[a-z]/.test(watchPassword),
    number: /[0-9]/.test(watchPassword),
    special: /[@$!%\*?&]/.test(watchPassword),
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmitForm = async (values: RegisterUserValues) => {
    const result = await registerUser(values);

    if (!result.success) {
      toast.error(result?.message || "Terjadi kesalahan.");
    } else {
      toast.success(result.message, {
        position: "top-right",
      });
      onSubmitSuccess();
    }
  };

  return (
    <>
      <form
        id="form-add-new-user"
        onSubmit={handleSubmit(handleSubmitForm)}
        className="space-y-4 p-6 py-3"
      >
        <input
          type="text"
          name="prevent_autofill_username"
          style={{ display: "none" }}
          disabled
        />
        <input
          type="password"
          name="prevent_autofill_password"
          style={{ display: "none" }}
          disabled
        />
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="name"
                className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
              >
                Nama Pengguna/Unit
              </FieldLabel>
              <Input
                {...field}
                id="name"
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="Masukkan nama pengguna/unit"
                autoComplete="new-name"
              />
              {watchName && (
                <div className="mt-2 rounded-lg border bg-slate-50 p-3 text-xs dark:bg-slate-900">
                  <ul className="space-y-1">
                    <li
                      className={`flex items-center gap-1.5 ${isNameValid ? "text-green-600" : "text-red-500"}`}
                    >
                      {isNameValid ? "✅" : "❌"} Hanya boleh berisi huruf (A-Z,
                      a-z) dan spasi
                    </li>
                  </ul>
                </div>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="email"
                className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
              >
                Email
              </FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="Contoh: pengguna@gmail.com"
                autoComplete="new-email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="role"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="role"
                className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
              >
                Role Akses
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="role" aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {ROLE_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="password"
                className="text-primary block w-max cursor-pointer after:ml-1 after:text-red-500 after:content-['*']"
              >
                Password
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="password"
                  type={passwordShown ? "text" : "password"}
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <InputGroupAddon align="inline-end">
                  <button
                    name="passwordShown"
                    type="button"
                    aria-label="toggle password visibility"
                    onClick={togglePassword}
                  >
                    {passwordShown ? (
                      <IconEye stroke={2} />
                    ) : (
                      <IconEyeOff stroke={2} />
                    )}
                    <span className="sr-only">Pasword Shown</span>
                  </button>
                </InputGroupAddon>
              </InputGroup>
              {watchPassword && (
                <div className="mt-2 rounded-lg border bg-slate-50 p-3 text-xs dark:bg-slate-900">
                  <p className="mb-1 font-medium text-slate-600 dark:text-slate-400">
                    Password harus mengandung:
                  </p>
                  <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    <li
                      className={`flex items-center gap-1.5 ${passwordValidation.length ? "text-green-600" : "text-red-500"}`}
                    >
                      {passwordValidation.length ? "✅" : "❌"} Minimal 8
                      karakter
                    </li>
                    <li
                      className={`flex items-center gap-1.5 ${passwordValidation.uppercase ? "text-green-600" : "text-red-500"}`}
                    >
                      {passwordValidation.uppercase ? "✅" : "❌"} Huruf besar
                      (A-Z)
                    </li>
                    <li
                      className={`flex items-center gap-1.5 ${passwordValidation.lowercase ? "text-green-600" : "text-red-500"}`}
                    >
                      {passwordValidation.lowercase ? "✅" : "❌"} Huruf kecil
                      (a-z)
                    </li>
                    <li
                      className={`flex items-center gap-1.5 ${passwordValidation.number ? "text-green-600" : "text-red-500"}`}
                    >
                      {passwordValidation.number ? "✅" : "❌"} Angka (0-9)
                    </li>
                    <li
                      className={`flex items-center gap-1.5 ${passwordValidation.special ? "text-green-600" : "text-red-500"}`}
                    >
                      {passwordValidation.special ? "✅" : "❌"} Karakter khusus
                      (@$!%*?&)
                    </li>
                  </ul>
                </div>
              )}

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
      <DialogFooter className="bg-background sticky bottom-0 flex gap-2 rounded-b-4xl border-t p-4 sm:justify-end">
        <DialogClose asChild>
          <Button variant="outline" type="button" size={"lg"}>
            Batal
          </Button>
        </DialogClose>
        <LoadingButton
          type="submit"
          form="form-add-new-user"
          size="lg"
          variant="default"
          loadingType="submit"
          loading={isSubmitting}
          disabled={isSubmitting || !isDirty || !isValid}
        >
          {isSubmitting ? "Menyimpan..." : "Tambah Pengguna"}
        </LoadingButton>
      </DialogFooter>
    </>
  );
};
