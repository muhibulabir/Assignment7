"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function ProfileSignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        throw new Error(result.error.message || "সাইন আউট করা যায়নি");
      }
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "সাইন আউট করা যায়নি");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-outline btn-error btn-sm rounded-lg"
      onClick={signOut}
      disabled={busy}
    >
      {busy ? (
        <span className="loading loading-spinner loading-xs" aria-label="সাইন আউট হচ্ছে" />
      ) : (
        <span aria-hidden="true">↪</span>
      )}
      সাইন আউট
    </button>
  );
}
