import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="container-shell grid min-h-[70vh] place-items-center">
          <span className="loading loading-spinner loading-lg text-leaf" />
        </div>
      }
    >
      <AuthForm mode="signin" />
    </Suspense>
  );
}
