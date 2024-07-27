import Image from "next/image";
import React from "react";
import logo from "../../public/logo.svg";
import Link from "next/link";

type Props = {};

const Logo = (props: Props) => {
  return (
    <Link href="/">
      <Image src={logo} alt="PetSoft logo" />
    </Link>
  );
};

export default Logo;
