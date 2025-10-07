import { Geist, Geist_Mono, Montserrat_Alternates } from "next/font/google";
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const montserAlt = Montserrat_Alternates({
        variable: "--font-montser-alt",
        subsets: ["latin"],
        weight: ["500", "700"]
    }
);