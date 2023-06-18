import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import AuthForm from "../components/auth/authForm";

function AuthPage() {
  const { data, status } = useSession();
  const router = useRouter();

  if (status !== "loading" && data) {
    router.replace("/");
  }

  if (status === "loading") return <p>Loading...</p>;

  return <AuthForm />;
}

export default AuthPage;
