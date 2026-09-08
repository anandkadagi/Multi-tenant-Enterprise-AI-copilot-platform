import { Space_Grotesk, Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import Script from "next/script";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-display",
    weight: ["500", "600", "700"],
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-body",
    weight: ["400", "500", "600"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
            <body className="font-body bg-[#050A16] text-[#F1F5F9]">
                <Providers>{children}</Providers>
                <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
 
            </body>
        </html>
    );
}