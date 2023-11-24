import { UploadCloud } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export default function BackgroundImageInput({
  image,
  setImage,
  defaultImage,
}: {
  image: { data: string; contentType: string } | null;
  setImage: React.Dispatch<
    React.SetStateAction<{ data: string; contentType: string } | null>
  >;
  defaultImage: string | null;
}) {
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage({
          data: e.target?.result as string,
          contentType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="w-full relative border rounded-md h-24 sm:h-32 overflow-hidden">
      <Image
        src={
          image?.data ??
          defaultImage ??
          'https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        }
        alt="background image of a user"
        fill
        className="object-cover"
      />

      <label
        htmlFor="background-image"
        className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
      >
        <div className="bg-black/80 p-4 rounded-full">
          <UploadCloud className="w-5 h-5 text-foreground" />
        </div>
        <input
          type="file"
          name="background-image"
          id="background-image"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
}
