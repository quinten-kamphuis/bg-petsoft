"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import PetForm from "./pet-form";
import { ActionType } from "@/lib/types";
import { flushSync } from "react-dom";

type Props = {
  action: ActionType;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

const PetButton = ({ action, children, onClick, disabled }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  if (action === "checkout") {
    return (
      <Button variant="secondary" onClick={onClick} disabled={disabled}>
        {children || "Checkout"}
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {action === "add" ? (
          <Button size="icon" disabled={disabled}>
            <PlusIcon className="h-6 w-6" />
          </Button>
        ) : (
          <Button variant="secondary" disabled={disabled}>
            {children || "Edit"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "add" ? "Add a new pet" : "Edit pet"}
          </DialogTitle>
        </DialogHeader>
        <PetForm
          action={action}
          onFormSubmission={() => {
            flushSync(() => {
              setIsOpen(false);
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PetButton;
