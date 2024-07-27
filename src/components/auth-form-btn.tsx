"use client";

import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

type Props = {
  action: "login" | "signup";
};

const AuthFormBtn = ({ action }: Props) => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending}>
      {action === "login" ? "Log In" : "Sign Up"}
    </Button>
  );
};

export default AuthFormBtn;
