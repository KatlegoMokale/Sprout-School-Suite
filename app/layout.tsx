import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./(root)/StoreProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AppShell from "@/components/layout/app-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});

export const metadata: Metadata = {
  title: "Sprouts School Suite",
  description: "Daycare Dashboard is a modern school management system.",
  icons: { icon: "/assets/logoSSS.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        <ThemeProvider>
          <ReduxProvider>
            <AppShell>{children}</AppShell>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
