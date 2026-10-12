import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-shell grid min-h-[70vh] place-items-center py-16">
      <div className="max-w-lg text-center">
        <p className="text-7xl font-black tracking-tight text-[#dce9d4]">৪০৪</p>
        <span className="mt-2 block text-5xl" aria-hidden="true">🧺</span>
        <h1 className="mt-5 text-3xl font-extrabold text-ink">এই পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1>
        <p className="mt-3 text-[#718077]">ঠিকানাটি হয়তো বদলে গেছে। বাজারের দর দেখতে হোম পেজে ফিরে যান।</p>
        <Link href="/" className="btn btn-primary mt-6 rounded-full px-6">হোম পেজে ফিরে যান</Link>
      </div>
    </section>
  );
}
