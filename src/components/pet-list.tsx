"use client";

import { usePetContext, useSearchContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";

type Props = {};

const PetList = (props: Props) => {
  const { pets, selectedPetId, setSelectedPetId } = usePetContext();
  const { search } = useSearchContext();
  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ul className="bg-white border-b border-black/light">
      {filteredPets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => setSelectedPetId(pet.id)}
            className={cn(
              `flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3
               hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition`,
              selectedPetId === pet.id && "bg-[#EFF1F2]"
            )}
          >
            <Image
              src={
                pet.imageUrl ||
                "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
              }
              alt={pet.name}
              height={45}
              width={45}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{pet.name}</p>
            {selectedPetId === pet.id && <ArrowRightIcon />}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PetList;
