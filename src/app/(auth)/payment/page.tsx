"use client";

import { createPaymentSession } from "@/actions/actions";
import H1 from "@/components/h1";
import SignOutButton from "@/components/sign-out-btn";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const PaymentPage = ({ searchParams }: Props) => {
  const [isPending, startTransition] = useTransition();
  const { data: session, update, status } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center text-center gap-10">
      <H1>PetSoft access requires payment</H1>

      <div>
        {!searchParams.success && (
          <Button
            disabled={isPending}
            onClick={async () => {
              startTransition(async () => {
                await createPaymentSession();
              });
            }}
          >
            Buy lifetime acces for $299
          </Button>
        )}

        {searchParams.success && (
          <>
            <Button
              disabled={status === "loading" || session?.user.hasAccess}
              onClick={async () => {
                await update(true);
                router.push("/app/dashboard");
              }}
            >
              Access PetSoft
            </Button>
            <p className="text-sm text-green-700 mt-3">
              Payment successful! You now have lifetime access to PetSoft
            </p>
          </>
        )}

        {searchParams.canceled && (
          <p className="text-sm text-red-700 mt-3">
            Payment canceled. Try again.
          </p>
        )}
      </div>
    </main>
  );
};

export default PaymentPage;
