"use client";

import { usePetContext } from "@/lib/hooks";
import React from "react";

type Props = {};

const Stats = (props: Props) => {
  const { amountOfPets } = usePetContext();
  return (
    <section className="text-center">
      <p className="text-2xl font-bold leading-6">{amountOfPets}</p>
      <p className="opacity-80">current guests</p>
    </section>
  );
};

export default Stats;
