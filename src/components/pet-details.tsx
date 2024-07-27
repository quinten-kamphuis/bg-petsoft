"use client";

import { usePetContext } from "@/lib/hooks";
import Image from "next/image";
import PetButton from "./pet-button";

type Props = {};

const PetDetails = (props: Props) => {
  const { selectedPet, handleCheckoutPet } = usePetContext();
  return (
    <section className="h-full w-full flex flex-col">
      {!selectedPet && (
        <div className="h-full flex-center">
          <p className="text-2xl font-medium">No pet selected</p>
        </div>
      )}
      {selectedPet && (
        <>
          <div className="flex items-center bg-white px-8 py-5 border-b border-black/light">
            <Image
              src={
                selectedPet.imageUrl ||
                "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
              }
              alt={selectedPet.name}
              width={75}
              height={75}
              className="h-[75px] w-[75px] rounded-full object-cover "
            />
            <h2 className="text-3xl font-semibold leading-7 ml-5">
              {selectedPet.name}
            </h2>

            <div className="ml-auto space-x-2">
              <PetButton action="edit" />
              <PetButton
                action="checkout"
                onClick={() => handleCheckoutPet(selectedPet.id)}
              />
            </div>
          </div>

          <div className="flex py-10 px-5 text-center">
            <div className="w-1/2">
              <h3 className="text-[13px] font-medium uppercase text-zinc-700">
                Owner name
              </h3>
              <p className="mt-1 text-lg text-zinc-800">
                {selectedPet.ownerName}
              </p>
            </div>
            <div className="w-1/2">
              <h3 className="text-[13px] font-medium uppercase text-zinc-700">
                Age
              </h3>
              <p className="mt-1 text-lg text-zinc-800">{selectedPet.age}</p>
            </div>
          </div>

          <section className="flex-1 bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-black/light">
            {selectedPet.notes}
          </section>
        </>
      )}
    </section>
  );
};

export default PetDetails;
