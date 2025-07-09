import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Dr. Ajay Krishna Murthy - Oculoplasty Specialist | Bangalore",
  description: "Dr. Ajay Krishna Murthy - MS Ophthalmology specialist in Oculoplasty from JIPMER, Pondicherry. Expert in eyelid surgery, orbital surgery, and aesthetic procedures in Bangalore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
