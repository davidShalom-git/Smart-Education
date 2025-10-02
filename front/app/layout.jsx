// ✅ app/layout.tsx (Server Component)
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthWrapper from "./Component/AuthWrapper"; // client component
import Nav from "./Component/nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "E-Learning Platform",
  description: "A platform for online learning",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
          <Nav />
          <AuthWrapper>{children}</AuthWrapper>

          {/* Enhanced Background Elements - Dark Green Theme */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Animated grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>

            {/* Floating orbs */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 -right-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-lime-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
          </div>
        </div>


      </body>
    </html>
  );
} 