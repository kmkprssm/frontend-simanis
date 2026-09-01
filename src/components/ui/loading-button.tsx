import { Button } from "./button";
import { Loader } from "./loader";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
  variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "login"
    | "delete";
  size:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg";
  loadingType: "submit";
}

export const LoadingButton = ({
  children,
  loading,
  variant,
  size,
  loadingType,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      disabled={props.disabled || loading}
    >
      {loadingType === "submit" && (
        <div className="relative flex items-center gap-2">
          {loading && <Loader />}
          {children}
        </div>
      )}
    </Button>
  );
};
