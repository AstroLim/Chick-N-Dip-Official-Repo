import "./globals.css";
import { Bebas_Neue, Archivo_Black, Archivo } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const archivo = Archivo({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Chick N' Dip – Every Bite Better With Dip",
  description: "Crispy fried chicken paired with our signature house-made dipping sauces. Made fresh, served bold.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${archivoBlack.variable} ${archivo.variable}`}>
      <body style={{ fontFamily: "var(--font-body)" }}>
        {children}
      </body>
    </html>
  );
}
