import { League_Gothic, Space_Grotesk } from "next/font/google";

// Tipografías oficiales del manual de marca DL:
// League Gothic para títulos (condensada, impacto) y Space Grotesk para textos.
export const leagueGothic = League_Gothic({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-display",
    display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});
