"use client";

import { type FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface ProfileUpdateFormProps {
  initialName: string;
}

export function ProfileUpdateForm({ initialName }: ProfileUpdateFormProps) {
  const router = useRouter();
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    submitting.current = true;
    setBusy(true);
    try {
      const result = await authClient.updateUser({ name });
      if (result.error) {
        throw new Error(result.error.message || "তথ্য আপডেট করা যায়নি");
      }
      toast.success("আপনার তথ্য আপডেট হয়েছে");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "তথ্য আপডেট করা যায়নি");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
      <label htmlFor="profile-update-name" className="pl-1 text-sm text-[#6f7b72]">নাম</label>
      <input
        id="profile-update-name"
        className="input input-bordered w-full rounded-lg"
        name="name"
        defaultValue={initialName}
        autoComplete="name"
        required
        disabled={busy}
      />
      <button type="submit" className="btn btn-primary w-full rounded-lg" disabled={busy}>
        {busy ? <span className="loading loading-spinner loading-sm" aria-label="আপডেট হচ্ছে" /> : "আপডেট"}
      </button>
    </form>
  );
}
