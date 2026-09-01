"use client";

import { IconAlertTriangle } from "@tabler/icons-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertOverdueProps {
  overdueCount: number;
  activeTab: string;
}

export const AlertOverdue = ({
  overdueCount,
  activeTab,
}: AlertOverdueProps) => {
  if (overdueCount === 0 || activeTab !== "risiko-aktif") return null;

  return (
    <Alert
      variant="destructive"
      className="mb-4 animate-[pulseShadow_3s_infinite_ease-in-out] rounded-xl border-red-200 bg-red-50 text-red-900 shadow-xs"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 rounded-lg border border-red-200 bg-red-100 p-1.5 text-red-600">
          <IconAlertTriangle className="h-5 w-5 animate-pulse" />
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <AlertTitle className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-red-900">
            Perhatian Tindak Lanjut!
          </AlertTitle>
          <AlertDescription className="text-xs leading-relaxed font-normal text-red-700">
            Terdapat{" "}
            <span className="mx-0.5 rounded bg-red-200/60 px-1.5 py-0.5 font-extrabold text-red-900">
              {overdueCount}
            </span>{" "}
            tindakan penanganan (*action plan*) mitigasi yang telah{" "}
            <span className="font-bold underline decoration-red-400 decoration-2">
              melewati batas waktu (Deadline)
            </span>{" "}
            target penyelesaian. Mohon untuk segera melakukan evaluasi kondisi
            lapangan dan memperbarui progres dokumen.
          </AlertDescription>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulseShadow {
          0% {
            box-shadow: 0 1px 2px 0 rgba(220, 38, 38, 0.05);
          }
          50% {
            box-shadow: 0 4px 12px 0 rgba(220, 38, 38, 0.12);
            border-color: rgba(220, 38, 38, 0.3);
          }
          100% {
            box-shadow: 0 1px 2px 0 rgba(220, 38, 38, 0.05);
          }
        }
      `}</style>
    </Alert>
  );
};
