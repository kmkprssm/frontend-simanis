import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/contexts/providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Manrisk RSSM",
    template: "%s - Manrisk RSSM",
  },
  description:
    "Mengelola manajemen risiko RSUD dr. Soedono Provinsi Jawa Timur",
  creator: "RSUD dr. Soedono Provinsi Jawa Timur",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  applicationName: "Manrisk RSSM",
  keywords: [
    "manrisk rssm",
    "rssm",
    "RSUD dr. Soedono Madiun",
    "soedono",
    "manajemen risiko soedono",
    "manajemen risiko",
    "manrisk",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", poppins.variable, "font-sans")}
      suppressHydrationWarning
    >
      <body className={cn("flex min-h-full flex-col", poppins.className)}>
        <Providers>
          <TooltipProvider>
            <Toaster
              toastOptions={{
                classNames: {
                  content: "gap-1.5",
                  success: "group bg-background border-border",
                  error: "group bg-destructive border-destructive-foreground",
                  description:
                    "group-data-[type=error]:text-destructive-foreground/90 group-data-[type=success]:text-muted-foreground group-data-[type=warning]:text-muted-foreground group-data-[type=info]:text-muted-foreground",
                  title:
                    "group-data-[type=error]:text-destructive-foreground group-data-[type=success]:text-foreground group-data-[type=warning]:text-foreground group-data-[type=info]:text-foreground leading-none",
                  icon: "group-data-[type=error]:text-destructive-foreground group-data-[type=success]:text-foreground group-data-[type=warning]:text-foreground group-data-[type=info]:text-foreground",
                },
              }}
              position="top-right"
            />
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
