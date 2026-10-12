"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { formatBanglaDate } from "@/lib/format";
import type { Category } from "@/types/bazardor";

interface NavbarProps {
  categories: Category[];
}

export function Navbar({ categories }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const categoryLinks = categories.map((category) => ({
    href: `/category/${category.slug}`,
    label: `${category.icon} ${category.nameBn}`,
  }));
  const mobileLinks = [
    { href: "/", label: "হোম" },
    ...categoryLinks,
  ];

  async function signOut() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message ?? "সাইন আউট করা যায়নি");
        return;
      }
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      setMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "সাইন আউট করা যায়নি");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#e1e8e1] bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] w-full max-w-[1164px] items-center justify-between gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="বাজার দর হোম">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#008b45] text-xl" aria-hidden="true">
            🛒
          </span>
          <span>
            <span className="block text-lg font-bold leading-tight text-ink">বাজার দর</span>
            <span className="block text-xs text-[#6f7b72]">{formatBanglaDate()}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {isPending ? (
            <span className="loading loading-spinner loading-sm text-leaf" aria-label="লোড হচ্ছে" />
          ) : session ? (
            <details className="dropdown dropdown-end">
              <summary className="btn btn-ghost btn-sm h-11 rounded-full normal-case">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-xl object-cover"
                  />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf3ea] text-sm text-leaf" aria-hidden="true">👤</span>
                )}
                <span className="max-w-36 truncate">{session.user.name || session.user.email}</span>
                <span aria-hidden="true">▾</span>
              </summary>
              <div className="dropdown-content z-50 mt-3 flex h-[170px] w-64 flex-col rounded-2xl border border-[#e1e8e1] bg-white p-4 shadow-card">
                <div className="border-b border-[#e1e8e1] pb-3">
                  <p className="truncate font-bold text-ink">{session.user.name || "নাম যোগ করা হয়নি"}</p>
                  <p className="mt-0.5 truncate text-sm text-[#6f7b72]">{session.user.email}</p>
                </div>
                <Link href="/profile" className="mt-2 flex items-center gap-2 rounded-lg px-1 py-2 font-medium text-ink hover:text-leaf">
                  <span aria-hidden="true">👤</span>
                  আমার প্রোফাইল
                </Link>
                <button type="button" className="flex items-center gap-2 rounded-lg px-1 py-2 text-left font-medium text-red-500 hover:bg-red-50" onClick={signOut}>
                  <span aria-hidden="true">↪</span>
                  সাইন আউট
                </button>
              </div>
            </details>
          ) : (
            <>
              <Link href="/signin" className="rounded-full px-3 py-2 text-sm font-semibold text-ink hover:bg-[#f1f5f1]">
                সাইন ইন
              </Link>
              <Link href="/signup" className="btn btn-sm rounded-lg bg-leaf px-4 text-white hover:bg-[#20563d]">
                সাইন আপ
              </Link>
            </>
          )}
        </div>

        <button
          className="btn btn-square btn-ghost lg:hidden"
          type="button"
          aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="text-xl" aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      <nav className="hidden h-[49px] border-t border-[#e1e8e1] lg:block" aria-label="বাজার বিভাগ">
        <div className="mx-auto flex h-full w-full max-w-[1164px] items-center justify-start gap-1 px-8">
          {categoryLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active ? "bg-leaf text-white" : "text-[#35453a] hover:bg-[#f1f5f1]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {menuOpen && (
        <div className="container-shell border-t border-[#e1e8e1] pb-4 pt-3 lg:hidden">
          <nav className="grid gap-1" aria-label="মোবাইল নেভিগেশন">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`rounded-xl px-4 py-3 font-semibold ${
                  pathname === link.href ? "bg-leaf text-white" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-[#e1e8e1] pt-3">
            {session ? (
              <div className="rounded-xl border border-[#e1e8e1] bg-white p-4">
                <p className="truncate font-bold text-ink">{session.user.name || "নাম যোগ করা হয়নি"}</p>
                <p className="truncate text-sm text-[#6f7b72]">{session.user.email}</p>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="mt-2 flex items-center gap-2 rounded-lg py-2 font-medium text-ink">
                  <span aria-hidden="true">👤</span>
                  আমার প্রোফাইল
                </Link>
                <button className="flex items-center gap-2 rounded-lg py-2 font-medium text-red-500" onClick={signOut}>
                  <span aria-hidden="true">↪</span>
                  সাইন আউট
                </button>
              </div>
            ) : (
              <>
                <Link href="/signin" onClick={() => setMenuOpen(false)} className="btn btn-ghost flex-1">সাইন ইন</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="btn btn-primary flex-1">সাইন আপ</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
