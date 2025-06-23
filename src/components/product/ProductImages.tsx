"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImages({ images }: { images: any[] }) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full aspect-square flex items-center justify-center">
        <span className="text-gray-500">No images</span>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
        <Image
          src={images[selectedImage].url}
          alt={`Product image ${selectedImage + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto py-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(index)}
            className={`min-w-[80px] h-20 relative rounded-md overflow-hidden border-2 ${
              selectedImage === index ? "border-primary" : "border-transparent"
            }`}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
