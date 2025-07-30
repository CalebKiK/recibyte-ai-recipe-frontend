
import { Geist, Geist_Mono } from "next/font/google";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
// import BootstrapClient from '@/components/BootstrapClient';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RecipByte",
  description: "Unlock culinary magic with AI! Just input your ingredients and let our smart generator create delicious recipes tailored to your pantry and preferences.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      {/* <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
        />
      </head> */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <BootstrapClient /> */}
        <AuthProvider><main>{children}</main></AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              duration: 4000,
            },
            error: {
              duration: 5000,
            },
          }}
        />
        {/* <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" /> */}
      </body>
    </html>
  );
}
