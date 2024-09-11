import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { AntdRegistry } from '@ant-design/nextjs-registry';
// import 'antd/dist/reset.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Shopyy - Product List",
    description: "View our product catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            <AntdRegistry>
                {children}
            </AntdRegistry>
        </AuthProvider>
        </body>
        </html>
    );
}
