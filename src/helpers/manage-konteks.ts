import { ExtendedUser } from "@/next-auth";

const allowedUsers = [
  { name: "KOMITE PPI", email: "ppisoedono@gmail.com" },
  { name: "KOMITE MUTU DAN KESELAMATAN PASIEN", email: "kmkprssm@gmail.com" },
  {
    name: "KOMITE KESELAMATAN DAN KESEHATAN KERJA",
    email: "k3rssoedono@gmail.com",
  },
];

export const canManageKonteks = (user?: ExtendedUser) => {
  if (!user) return false;

  if (user.role !== "ADMIN") return false;

  return allowedUsers.some(
    (allowed) => user.email === allowed.email || user.name === allowed.name,
  );
};
