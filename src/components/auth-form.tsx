"use client";

import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { logIn, signUp } from "@/actions/actions";
import AuthFormBtn from "./auth-form-btn";
import { useFormState } from "react-dom";

type Props = {
  action: "login" | "signup";
};

const AuthForm = ({ action }: Props) => {
  const [signUpError, dispatchSignUp] = useFormState(signUp, undefined);
  const [logInError, dispatchLogIn] = useFormState(logIn, undefined);

  return (
    <form action={action === "login" ? dispatchLogIn : dispatchSignUp}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input type="email" name="email" id="email" required maxLength={50} />
      </div>
      <div className="mb-4 mt-2 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          required
          maxLength={50}
        />
      </div>

      <AuthFormBtn action={action} />

      {signUpError && (
        <p className="text-red-500 text-s mt-2">{signUpError.message}</p>
      )}
      {logInError && (
        <p className="text-red-500 text-s mt-2">{logInError.message}</p>
      )}
    </form>
  );
};

export default AuthForm;
