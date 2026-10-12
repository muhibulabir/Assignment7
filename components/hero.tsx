import Image from "next/image";
import Link from "next/link";
import { formatBanglaDate } from "@/lib/format";

export function Hero() {
  return (
    <section className="container-shell px-4 pt-6">
      <div className="design-surface overflow-hidden rounded-2xl px-4 py-5 sm:px-6 lg:h-[283px] lg:px-4 lg:py-4">
        <div className="grid h-full items-center gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(260px,1fr)] lg:grid-cols-[576px_410px] lg:justify-between">
          <div className="max-w-[576px]">
            <span className="inline-flex items-center rounded-lg border border-[#e1e8e1] bg-white px-3 py-1 text-xs font-medium text-[#536356]">
              {formatBanglaDate()}
            </span>
            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="mt-2 max-w-[576px] text-sm leading-6 text-[#58665d] sm:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="#সব-পণ্য" className="btn btn-sm rounded-lg border-0 bg-leaf px-4 text-white hover:bg-[#20563d]">
                সব পণ্য দেখুন
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[410px]">
            <Image
              src="/bazar-hero.png"
              alt="বাংলাদেশের বাজারের তাজা নিত্যপ্রয়োজনীয় পণ্য"
              width={600}
              height={420}
              priority
              className="mx-auto h-[220px] w-full object-contain sm:h-[240px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
