import { Suspense } from "react";

import { Loader } from "@/components/ui/loader";
import type { Metadata } from "next";
import { currentUser } from "@/lib/auth";
import { MasterUsers } from "@/components/master-users";
import { getAllUsers } from "@/server/apis/users";

export const metadata: Metadata = {
  title: "Master User",
  description: "Ringkasan data manajemen risiko.",
};

export default async function MasterUserPage() {
  const user = await currentUser();

  if (user?.role !== "ADMIN") {
    return (
      <span className="text-foreground flex items-center justify-center p-4 text-2xl font-bold">
        Anda tidak memiliki akses ke menu ini!
      </span>
    );
  }

  const usersData = await getAllUsers();

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        }
      >
        <MasterUsers data={usersData} />
      </Suspense>
    </>
  );
}
