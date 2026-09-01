import { cn } from "@/lib/utils";
import { IconLoader2 } from "@tabler/icons-react";

type LoaderPorps = React.SVGProps<SVGSVGElement>;

export const Loader = ({ className }: LoaderPorps) => {
  return (
    <IconLoader2 stroke={2} className={cn("h-5 w-5 animate-spin", className)} />
  );
};
