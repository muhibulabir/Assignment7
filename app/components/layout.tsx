import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PriceTicker } from "@/components/price-ticker";
import { getCategories, getProducts } from "@/lib/api";
import type { Category, Product } from "@/types/bazardor";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "বাজার দর — বাংলাদেশের বাজারের আজকের দাম",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারভিত্তিক আজকের দাম এক নজরে দেখুন।",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [categoryResult, productResult] = await Promise.allSettled([
    getCategories(),
    getProducts(),
  ]);
  const categories: Category[] =
    categoryResult.status === "fulfilled" ? categoryResult.value : [];
  const products: Product[] =
    productResult.status === "fulfilled" ? productResult.value : [];
  const marketDataUnavailable =
    categoryResult.status === "rejected" || productResult.status === "rejected";

  return (
    <html lang="bn" data-theme="bazardor">
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <Navbar categories={categories} />
        <PriceTicker products={products} />
        {marketDataUnavailable && (
          <div
            role="status"
            className="border-b border-[#f0d7a7] bg-[#fff8e8] px-4 py-2 text-center text-sm text-[#72571f]"
          >
            বাজারদরের তথ্য এই মুহূর্তে লোড করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।
          </div>
        )}
        <main className="min-h-[65vh]">{children}</main>
        <div className="h-12" aria-hidden="true" />
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3200,
            style: {
              borderRadius: "14px",
              background: "#20352c",
              color: "#fffdf8",
              fontFamily: "inherit",
            },
          }}
        />
      </body>
    </html>
  );
}
