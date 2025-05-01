import React from "react";
import Image from "next/image";

type CarousselImageProps = {
  imageUrl: string;
};

export default function CarousselImage({ imageUrl }: CarousselImageProps) {
  return (
    <div className="relative w-fit mx-auto">
      <div className="absolute -left-8 top-8 w-[300px] h-[400px] bg-secondary-light rounded-md z-0" />
      <div className="absolute -left-4 top-4 w-[300px] h-[400px] bg-secondary-medium rounded-md z-10" />
      <div className="relative z-20 w-[300px] h-[400px]">
        <Image
          src={imageUrl}
          alt="Portrait"
          fill
          className="rounded-md object-cover"
        />
      </div>
    </div>
  );
}
