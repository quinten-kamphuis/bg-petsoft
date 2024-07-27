"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetType } from "@/lib/types";
import { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type Props = {
  children: React.ReactNode;
  data: PetType[];
};

type PetContextType = {
  selectedPet: PetType | null;
  pets: PetType[];
  selectedPetId: string | null;
  setSelectedPetId: (id: string) => void;
  amountOfPets: number;
  handleCheckoutPet: (id: string) => Promise<void>;
  handleAddPet: (pet: PetType) => Promise<void>;
  handleEditPet: (pet: PetType) => Promise<void>;
};

export const PetContext = createContext<PetContextType | null>(null);

const PetContextProvider = ({ children, data }: Props) => {
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, payload];
        case "edit":
          return state.map((pet) =>
            pet.id === payload.id ? { ...pet, ...payload.pet } : pet
          );
        case "delete":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const selectedPet =
    optimisticPets.find((pet) => pet.id === selectedPetId) || null;
  const amountOfPets = optimisticPets.length;

  const handleCheckoutPet = async (id: string) => {
    setOptimisticPets({
      action: "delete",
      payload: id,
    });
    const error = await deletePet(id);
    if (error) {
      toast.warning(error.message);
      return;
    }
    setSelectedPetId(null);
  };

  const handleAddPet = async (pet: PetType) => {
    setOptimisticPets({ action: "add", payload: pet });
    const error = await addPet(pet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (pet: PetType) => {
    setOptimisticPets({ action: "edit", payload: { id: selectedPetId, pet } });
    const error = await editPet(pet, selectedPetId!);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  return (
    <PetContext.Provider
      value={{
        selectedPet,
        pets: optimisticPets,
        selectedPetId,
        setSelectedPetId,
        amountOfPets,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export default PetContextProvider;
