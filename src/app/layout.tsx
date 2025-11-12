import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProfile } from "@/components/daydot/layout/Header/UserProfile";
import { Providers } from "./providers";
import { FeedbackButton } from "@/components/daydot/FeedbackButton";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "DayDot",
  description:
    "매일의 점이 모여 빛나는 당신이 될 거예요. DayDot은 감정과 하루를 간단히 기록하는 일기 서비스입니다.",
  keywords: [
    "DayDot",
    "감정일기",
    "무드트래커",
    "일기앱",
    "감정기록",
    "기록",
    "메모",
  ],
  authors: [{ name: "DayDot" }],
  metadataBase: new URL("https://daydot.me"),
  icons: {
    icon: "/favicon.ico", // ✅ public/ 경로 기준으로 작성
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L4LNDCVN1B"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L4LNDCVN1B');
          `}
        </Script>
      </head>
      <body className="flex max-h-screen flex-col items-center bg-gray-50 text-gray-900">
        <Providers>
          <div className="flex h-screen w-full max-w-[560px] flex-col">
            {/* Header */}
            <header className="flex h-12 items-center justify-between px-4">
              <div className="flex items-end gap-1">
                <span className="text-2xl font-extrabold tracking-tight">
                  DayDot
                </span>
                <div className="bg-primary mb-1.5 h-2 w-2 rounded-full" />
              </div>
              <div className="flex gap-2">
                <FeedbackButton />
                <UserProfile />
              </div>
            </header>

            {/* Main */}
            <main className="relative overflow-y-auto p-4">
              {children}
              <Toaster position="top-center" />
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
