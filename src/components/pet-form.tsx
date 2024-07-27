"use client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ActionType, PetType } from "@/lib/types";
import { usePetContext } from "@/lib/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDataType, petFormSchema } from "@/lib/validations";

type Props = {
  action: Omit<ActionType, "checkout">;
  onFormSubmission: () => void;
};

const PetForm = ({ action, onFormSubmission }: Props) => {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();

  const {
    register,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormDataType>({
    resolver: zodResolver(petFormSchema),
    defaultValues:
      action === "edit"
        ? {
            name: selectedPet?.name,
            ownerName: selectedPet?.ownerName,
            imageUrl: selectedPet?.imageUrl,
            age: selectedPet?.age,
            notes: selectedPet?.notes,
          }
        : undefined,
  });

  return (
    <form
      className="flex flex-col"
      action={async (formData) => {
        const result = await trigger();
        if (!result) return;
        onFormSubmission();

        const petData = getValues();

        if (action === "add") {
          await handleAddPet(petData as PetType);
        } else {
          await handleEditPet(petData as PetType);
        }
      }}
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" {...register("ownerName")} />
          {errors.ownerName && (
            <p className="text-red-500 text-sm">{errors.ownerName.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input id="age" {...register("age")} />
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register("notes")} />
          {errors.notes && (
            <p className="text-red-500 text-sm">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="mt-5 self-end">
        {action === "add" ? "Add Pet" : "Edit Pet"}
      </Button>
    </form>
  );
};

export default PetForm;
