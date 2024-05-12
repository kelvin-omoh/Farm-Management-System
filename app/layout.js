import { Inter } from "next/font/google";
import "./globals.css";
import { ProductsContextProvider } from "./components/ProductsContext";
import toast, { Toaster } from 'react-hot-toast';
import { NextUIProvider } from "@nextui-org/react";
import { Providers } from "./MainLayout";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProductsContextProvider>
          <Providers>

            {children}
          </Providers>
        </ProductsContextProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </body>

    </html>
  );
}
