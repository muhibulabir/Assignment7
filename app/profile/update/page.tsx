import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileSignOutButton } from "@/components/profile-sign-out-button";
import { ProfileUpdateForm } from "@/components/profile-update-form";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfileUpdatePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin?reason=profile&callbackURL=%2Fprofile%2Fupdate");
  }

  return (
    <section className="container-shell min-h-[65vh] py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 px-1">
          <h1 className="text-2xl font-bold text-ink">আমার প্রোফাইল</h1>
          <p className="mt-1 text-sm text-[#6f7b72]">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        </div>

        <div className="design-surface flex flex-col items-start justify-between gap-4 rounded-xl p-5 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-4">
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
          <ProfileUpdateForm initialName={session.user.name ?? ""} />
        </div>
      </div>
    </section>
  );
}
