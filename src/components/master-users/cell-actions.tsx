"use client";

import { IconInfoCircle } from "@tabler/icons-react";

import { Button } from "../ui/button";
import { useModalStore } from "@/stores/modal-store";
import { CustomTooltip } from "../custom-tooltip";
import { TMasterUser } from "@/types/user-type";
import { MasterUserDetail } from "./master-user-detail";

interface CellActionsProps {
  data: TMasterUser;
}

export const CellActions = ({ data }: CellActionsProps) => {
  const { onOpen } = useModalStore();

  return (
    <div className="flex items-center gap-2">
      <CustomTooltip
        align="center"
        side="top"
        tooltipContent={<>Detail Pengguna</>}
      >
        <Button
          variant={"detail"}
          size={"icon"}
          onClick={() =>
            onOpen(
              "detail",
              {
                title: "Detail Pengguna",
                message:
                  "Informasi lengkap mengenai pengguna aplikasi simanis.",
                childrenDetail: <MasterUserDetail data={data} />,
              },
              { userData: data },
            )
          }
        >
          <IconInfoCircle stroke={2} />{" "}
        </Button>
      </CustomTooltip>
    </div>
  );
};
