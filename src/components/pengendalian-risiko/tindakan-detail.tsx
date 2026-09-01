import { cn, dateFormat } from "@/lib/utils";
import {
  TKontrolRisiko,
  TRencanaAksiRisiko,
} from "@/types/perlakuan-risiko-type";
import { IconBriefcase, IconCalendar, IconCheck } from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface TindakanDetailProps {
  actions: TRencanaAksiRisiko[];
  kontrol: TKontrolRisiko;
  getTipeBadgeColor: (tipe: string) => void;
}

export const TindakanDetail = ({
  actions,
  kontrol,
  getTipeBadgeColor,
}: TindakanDetailProps) => {
  return (
    <div className="space-y-4 p-6 py-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold ${getTipeBadgeColor(kontrol.tipe)}`}
          >
            {kontrol.tipe}
          </Badge>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
            {actions.length} Tindakan
          </span>
        </div>
        <h5 className="line-clamp-2 text-xs leading-snug font-bold text-slate-800">
          {kontrol.nama_kontrol}
        </h5>
        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed font-normal">
          {kontrol.deskripsi}
        </p>
      </div>

      {actions.length === 0 ? (
        <div className="mx-auto my-4 max-w-md rounded-xl border border-dashed border-slate-200 bg-white p-6 py-10 text-center shadow-2xs">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border bg-slate-50 text-slate-400">
            <IconBriefcase className="h-5 w-5 stroke-[1.5]" />
          </div>
          <h6 className="text-sm font-bold text-slate-800">
            Belum Ada Tindakan
          </h6>
          <p className="mx-auto mt-1 mb-4 max-w-70 text-xs leading-normal text-slate-400">
            Kontrol ini belum memiliki rencana tindakan (Action Plan) mitigasi
            di lapangan.
          </p>
        </div>
      ) : (
        /* GRIDS CARD LIST TINDAKAN */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {actions.map((action) => {
            const isOverdue =
              new Date(action.target_date) < new Date() &&
              action.status !== "Closed";
            const isClosed = action.status === "Closed";
            const isOnProgress = action.status === "On Progress";

            return (
              <div
                key={action.id}
                className={cn(
                  "flex flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-2xs transition-all hover:shadow-xs",
                  isOverdue
                    ? "border-l-4 border-red-200 border-l-red-500"
                    : isClosed
                      ? "border-emerald-200 bg-emerald-50/10"
                      : "border-slate-200",
                )}
              >
                <div className="space-y-2.5 p-3.5">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={cn(
                        "rounded-md border-none px-2 py-0.5 text-[10px] font-bold shadow-none",
                        isClosed
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : isOnProgress
                            ? "bg-sky-100 text-sky-700 hover:bg-sky-100"
                            : isOverdue
                              ? "bg-red-100 text-red-700 hover:bg-red-100"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-100",
                      )}
                    >
                      {isOverdue ? "Overdue" : action.status}
                    </Badge>
                    <span
                      className={cn(
                        "text-[10px] font-bold tracking-tight",
                        isOverdue ? "text-red-500" : "text-slate-400",
                      )}
                    >
                      {dateFormat(action.target_date)}
                    </span>
                  </div>

                  <h6 className="min-h-9 text-xs leading-normal font-bold wrap-break-word text-slate-800">
                    {action.action_plan}
                  </h6>

                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-100/60 bg-slate-50 p-2 text-[11px] font-semibold text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="shadow-3xs rounded border bg-white px-1 text-[9px] font-black text-slate-400 uppercase">
                        PIC
                      </span>
                      <span className="truncate text-slate-600">
                        {action.pic_name}
                      </span>
                    </div>
                    {isClosed && (
                      <div className="flex items-center gap-1">
                        <IconCalendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span>
                          Realisasi:{" "}
                          <span className="font-semibold text-slate-700">
                            {dateFormat(action.realisasi_date)}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* FOOTER ACTIONS KONTROL */}
                <div className="flex items-center justify-end gap-1 border-t border-slate-100 bg-slate-50/50 p-2">
                  {isClosed && (
                    <div className="flex w-full items-center justify-between px-1 py-0.5">
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                        <IconCheck className="h-3.5 w-3.5" /> Selesai
                        Terverifikasi
                      </span>
                      {action.bukti_mitigasi && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 border-sky-200 bg-white px-2 text-[10px] font-bold text-sky-700 hover:bg-sky-50"
                          onClick={() =>
                            window.open(action.bukti_mitigasi, "_blank")
                          }
                        >
                          Lihat Bukti
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
