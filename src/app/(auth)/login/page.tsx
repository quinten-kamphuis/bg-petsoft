import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";
import React from "react";

type Props = {};

const Login = (props: Props) => {
  return (
    <main>
      <H1 className="text-center mb-5">Log In</H1>

      <AuthForm action="login" />

      <div className="text-center">
        <p className="mt-6 text-sm text-zinc-500">
          No account yet?{" "}
          <Link href="/signup" className="font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
