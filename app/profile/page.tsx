import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProfileSignOutButton } from "@/components/profile-sign-out-button";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin?reason=profile&callbackURL=%2Fprofile");
  }

  return (
    <section className="container-shell min-h-[65vh] py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 px-1">
          <h1 className="text-2xl font-bold text-ink">আমার প্রোফাইল</h1>
          <p className="mt-1 text-sm text-[#6f7b72]">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        </div>

        <div className="design-surface flex flex-col items-start justify-between gap-4 rounded-xl p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#edf3ea] text-2xl" aria-hidden="true">👤</div>
            <div className="min-w-0">
              <h2 className="truncate font-bold text-ink">{session.user.name || "নাম যোগ করা হয়নি"}</h2>
              <p className="truncate text-sm text-[#6f7b72]">{session.user.email}</p>
            </div>
          </div>
          <div className="flex w-full justify-end sm:w-auto">
            <ProfileSignOutButton />
          </div>
        </div>

        <div className="design-surface mt-4 rounded-xl p-5">
          <h2 className="font-bold text-ink">তথ্য</h2>
          <div className="py-4">
            <p className="mb-2 text-sm text-[#6f7b72]">নাম</p>
            <p className="rounded-lg border border-[#e1e8e1] bg-white px-3 py-2 text-sm text-ink">
              {session.user.name || "নাম যোগ করা হয়নি"}
            </p>
            <Link href="/profile/update" className="btn btn-primary btn-sm mt-3 w-full rounded-lg">আপডেট</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
