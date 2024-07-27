"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { signOutAction } from "@/actions/actions";

type Props = {
  className?: string;
  variant?: "default" | "secondary";
};

const SignOutButton = ({ className, variant = "default" }: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className={className}
      variant={variant}
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          signOutAction();
        });
      }}
    >
      Sign out
    </Button>
  );
};

export default SignOutButton;
