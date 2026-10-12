"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface AuthFormProps {
  mode: "signin" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = mode === "signup";
  const [busy, setBusy] = useState(false);
  const redirectToastShown = useRef(false);

  useEffect(() => {
    const reason = searchParams.get("reason");
    if ((reason === "protected" || reason === "profile") && !redirectToastShown.current) {
      toast.error(reason === "protected" ? "এই পণ্যটি দেখতে আগে সাইন ইন করুন" : "আপনার প্রোফাইল দেখতে আগে সাইন ইন করুন");
      redirectToastShown.current = true;
    }
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password || (isSignup && !name)) {
      toast.error("সবগুলো প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("একটি সঠিক ইমেইল ঠিকানা লিখুন");
      return;
    }
    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setBusy(true);
    try {
      if (isSignup) {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: "/signin",
        });
        if (result.error) throw new Error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে — এখন সাইন ইন করুন");
        router.replace("/signin");
        return;
      }

      const result = await authClient.signIn.email({ email, password });
      if (result.error) throw new Error(result.error.message || "সাইন ইন করা যায়নি");
      toast.success("সফলভাবে সাইন ইন হয়েছে");
      const callbackURL = searchParams.get("callbackURL");
      router.replace(
        callbackURL?.startsWith("/") && !callbackURL.startsWith("//")
          ? callbackURL
          : "/",
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "অনুরোধটি সম্পন্ন করা যায়নি");
    } finally {
      setBusy(false);
    }
  }

  async function handleSocial(provider: "google" | "github") {
    setBusy(true);
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
      if (result.error) throw new Error(result.error.message || "সোশ্যাল সাইন ইন ব্যর্থ হয়েছে");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "সোশ্যাল সাইন ইন ব্যর্থ হয়েছে");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container-shell flex min-h-[calc(100vh-272px)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md lg:-translate-y-[26px]">
        <div className="px-4 text-center">
          <h1 className="text-2xl font-bold text-ink">
            {isSignup ? "সাইন আপ" : "সাইন ইন"}
          </h1>
          <p className="mt-1 text-sm text-[#6f7b72]">
            {isSignup
              ? "বাজারের দর, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্ট তৈরি করুন।"
              : "বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"}
          </p>
        </div>

        <div className="design-surface mx-4 mt-6 rounded-xl p-5 sm:p-6">
          <form className="grid gap-3" onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <label className="form-control gap-1.5">
                <span className="text-sm font-semibold">আপনার নাম</span>
                <input className="input input-bordered h-11 min-h-0 w-full rounded-lg bg-white" name="name" autoComplete="name" required />
              </label>
            )}
            <label className="form-control gap-1.5">
              <span className="text-sm font-semibold">ইমেইল</span>
              <input
                className="input input-bordered h-11 min-h-0 w-full rounded-lg bg-white"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>
            <label className="form-control gap-1.5">
              <span className="text-sm font-semibold">পাসওয়ার্ড</span>
              <input
                className="input input-bordered h-11 min-h-0 w-full rounded-lg bg-white"
                name="password"
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={8}
                required
              />
            </label>
            <button className="btn btn-primary mt-1 rounded-lg text-base" type="submit" disabled={busy}>
              {busy ? <span className="loading loading-spinner" /> : isSignup ? "অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
            </button>
          </form>

          <div className="divider my-2 text-xs text-[#839087]">অথবা</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button className="btn btn-outline h-10 min-h-0 whitespace-nowrap rounded-lg bg-white px-2 text-xs" type="button" disabled={busy} onClick={() => handleSocial("google")}>
              <svg aria-hidden="true" viewBox="0 0 48 48" className="h-4 w-4 shrink-0">
                <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.571 5.098C41.62 35.153 44 29.927 44 24c0-1.341-.138-2.651-.389-3.917Z" />
                <path fill="#34A853" d="M24 44c5.518 0 10.155-1.827 13.54-4.953l-6.57-5.098C29.144 35.395 26.767 36.3 24 36.3c-5.328 0-9.845-3.595-11.46-8.43l-6.774 5.223C9.136 39.496 16.01 44 24 44Z" />
                <path fill="#FBBC05" d="M12.54 27.87A12.6 12.6 0 0 1 11.9 24c0-1.343.23-2.643.64-3.87l-6.774-5.223A19.93 19.93 0 0 0 3.6 24c0 3.224.773 6.27 2.166 9.093l6.774-5.223Z" />
                <path fill="#EA4335" d="M24 11.7c3.01 0 5.71 1.035 7.84 3.065l5.88-5.88C34.157 5.46 29.518 3.6 24 3.6c-7.99 0-14.864 4.504-18.234 11.307l6.774 5.223C14.155 15.295 18.672 11.7 24 11.7Z" />
              </svg>
              <span>Google দিয়ে চালিয়ে যান</span>
            </button>
            <button className="btn btn-outline h-10 min-h-0 whitespace-nowrap rounded-lg bg-white px-2 text-xs" type="button" disabled={busy} onClick={() => handleSocial("github")}>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current">
                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.59 1.21 3.22.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14A10.6 10.6 0 0 1 12 6.14c.95 0 1.9.13 2.79.37 2.12-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.35.75 1.02.75 2.06v3.09c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
              </svg>
              <span>GitHub দিয়ে চালিয়ে যান</span>
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-[#6f7b72]">
            {isSignup ? "আগে থেকেই অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
            <Link className="font-bold text-leaf hover:underline" href={isSignup ? "/signin" : "/signup"}>
              {isSignup ? "সাইন ইন করুন" : "সাইন আপ করুন"}
            </Link>
          </p>
        </div>

        <Link href="/" className="mt-5 block translate-y-1.5 px-4 text-center text-sm font-semibold text-leaf hover:underline">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  );
}
