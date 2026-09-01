"use client";

import * as React from "react";
import CONST from "@/lib/constants";
import { TKontrolRisiko } from "@/types/perlakuan-risiko-type";
import { toast } from "sonner";

export interface TSummary {
  avg: number;
  total_kejadian: number | null;
  inherent_score: number | null;
  residual_score: number | null;
  is_assessed: boolean;
}

export interface TRisikoDetail {
  id: string;
  nama_resiko: string;
  deskripsi: string;
  strategi: string;
  score: number;
  pemilik_risiko: string;
  status: string;
}

export function usePengendalian(selectedRisikoId: string, token: string) {
  const [kontrol, setKontrol] = React.useState<TKontrolRisiko[]>([]);
  const [summary, setSummary] = React.useState<TSummary | null>(null);
  const [risikoDetail, setRisikoDetail] = React.useState<TRisikoDetail | null>(
    null,
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [calculatingId, setCalculatingId] = React.useState<string | null>(null);
  const [calculatedIds, setCalculatedIds] = React.useState<string[]>([]);

  const loadRisikoDetail = React.useCallback(
    async (riskId: string) => {
      try {
        // Sesuaikan dengan rute API getIdentifikasiById Anda
        const res = await fetch(
          `${CONST.API_BASE_URL}/identifikasi/${riskId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setRisikoDetail(data);
        }
      } catch (err) {
        console.error("❌ Gagal load detail risiko:", err);
        setRisikoDetail(null);
      }
    },
    [token],
  );

  // 1. Load Data Kontrol
  const loadKontrol = React.useCallback(
    async (riskId: string) => {
      try {
        const res = await fetch(
          `${CONST.API_BASE_URL}/celah-pengendalian/kontrol/${riskId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setKontrol(data);
        }
      } catch (err) {
        console.error("❌ Gagal load kontrol:", err);
        setKontrol([]);
      }
    },
    [token],
  );

  const loadActions = React.useCallback(
    async (kontrolId: string) => {
      try {
        const res = await fetch(
          `${CONST.API_BASE_URL}/action/kontrol/${kontrolId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      } catch (err) {
        console.error("❌ Gagal load kontrol:", err);
        return [];
      }
    },
    [token],
  );

  // 2. Load Data Summary
  const loadSummary = React.useCallback(
    async (riskId: string) => {
      try {
        const res = await fetch(
          `${CONST.API_BASE_URL}/celah-pengendalian/summary/${riskId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setSummary({
            avg: Number(data.avg_effectiveness ?? 0),
            total_kejadian: Number(data.total_kejadian_bulan_ini ?? 0),
            residual_score:
              data.residual_score == null ? null : Number(data.residual_score),
            inherent_score:
              data.inherent_score == null ? null : Number(data.inherent_score),
            is_assessed: data.is_assessed,
          });
        }
      } catch (err) {
        console.error("❌ Gagal load summary:", err);
        setSummary(null);
      }
    },
    [token],
  );

  const clearData = React.useCallback(() => {
    setRisikoDetail(null);
    setKontrol([]);
    setSummary(null);
  }, []);

  React.useEffect(() => {
    // Jika tidak ada ID, jangan lakukan apa pun di dalam effect ini
    if (!selectedRisikoId) return;

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        loadRisikoDetail(selectedRisikoId),
        loadKontrol(selectedRisikoId),
        loadSummary(selectedRisikoId),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [selectedRisikoId, loadKontrol, loadSummary, loadRisikoDetail]);

  // Front end handler yang disederhanakan
  const handleHitungEfektivitas = async (kontrolId: string) => {
    if (!kontrolId) return;
    setCalculatingId(kontrolId);

    try {
      // Arahkan ke endpoint gabungan baru (Gunakan method POST demi keamanan mutasi data)
      const res = await fetch(
        `${CONST.API_BASE_URL}/celah-pengendalian/hitung-simpan/${kontrolId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = await res.json();

      if (res.ok) {
        // Ambil nilai yang murni dihitung oleh backend
        const newEffectiveness = result.data?.effectiveness ?? 0;

        // Update state lokal list kontrol agar UI langsung ter-update nilainya
        setKontrol((prev) =>
          prev.map((k) =>
            k.id === kontrolId ? { ...k, effectiveness: newEffectiveness } : k,
          ),
        );

        // Otomatis kalkulasi ulang summary atas risiko induknya (Residual Score diperbarui)
        if (selectedRisikoId) await loadSummary(selectedRisikoId);

        setCalculatedIds((prev) => [...prev, kontrolId]);
        toast.success("Efektivitas berhasil dihitung", {
          position: "top-right",
        });
      } else {
        toast.error(result.message || "Gagal memproses penilaian");
      }
    } catch (error) {
      console.error("❌ Gagal hitung & simpan efektivitas:", error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setCalculatingId(null);
    }
  };

  return {
    kontrol,
    summary,
    risikoDetail,
    loading,
    calculatingId,
    calculatedIds,
    loadActions,
    handleHitungEfektivitas,
    clearData,
    refreshData: () => {
      if (selectedRisikoId) {
        loadKontrol(selectedRisikoId);
        loadSummary(selectedRisikoId);
      }
    },
  };
}
