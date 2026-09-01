export type Role = "ADMIN" | "USER" | "GUEST";

// Role yang sifatnya hanya BISA MELIHAT (Read Only)
export const READ_ONLY_ROLES: Role[] = ["GUEST"];

/**
 * Cek apakah role saat ini adalah Read Only (misal: GUEST)
 */
export const isReadOnlyUser = (role?: string): boolean => {
  if (!role) return true; // Default aman: jika tidak ada role, anggap read-only
  return READ_ONLY_ROLES.includes(role as Role);
};

/**
 * Cek apakah role diizinkan melakukan aksi write (Create, Update, Delete)
 */
export const canWrite = (role?: string): boolean => {
  return !isReadOnlyUser(role);
};

/**
 * Pengecekan apakah user berhak melihat menu tertentu berdasarkan Role
 */
export const canAccessMenu = (role?: string, menuKey?: string): boolean => {
  if (!role) return false;

  const userRole = role as Role;

  // 1. Jika ADMIN: Memiliki akses ke SEMUA menu
  if (userRole === "ADMIN") return true;

  // 2. Jika USER: Hanya boleh akses 'dashboard' dan 'pemantauan-tinjauan'
  if (userRole === "GUEST") {
    return menuKey === "dashboard" || menuKey === "pemantauan-tinjauan";
  }

  // 3. Jika GUEST: Boleh lihat seluruh menu Manajemen Risiko & Dashboard, TAPI tidak boleh 'master-data'
  if (userRole === "USER") {
    return menuKey !== "master-data";
  }

  return false;
};
