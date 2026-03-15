import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ReBalance",
  description: "家計管理アプリ",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className="bg-slate-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}