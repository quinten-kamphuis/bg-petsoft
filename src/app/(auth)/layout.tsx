import Logo from "@/components/logo";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex-center min-h-screen flex-col gap-5">
      <Logo />
      {children}
    </div>
  );
};

export default AuthLayout;
