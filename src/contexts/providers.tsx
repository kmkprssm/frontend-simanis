import { AuthProvider } from "./auth-provider";
import { ModalStoreProvider } from "./modal-store-provider";
import { NProgressBarProvider } from "./progress-bar-provider";
import { QueryProvider } from "./query-provider";
import { RefreshTokenProvider } from "./refresh-token-provider";

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <AuthProvider>
      <RefreshTokenProvider>
        <QueryProvider>
          <ModalStoreProvider />
          <NProgressBarProvider>{children}</NProgressBarProvider>
        </QueryProvider>
      </RefreshTokenProvider>
    </AuthProvider>
  );
};
