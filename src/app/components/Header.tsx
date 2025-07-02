import Image from "next/image";
import React from "react";

export default function Header() {
  return (
    <div
      className="relative font-quicksand font-light text-xl text-white h-[46px] w-full border-b-2 border-void-800 flex items-center justify-center p-2"
      // style={{ position: "relative" }} // 'relative' is already in className, no need for inline style unless overriding
    >
      <Image
        alt="Background gradient"
        fill // Fills the parent container
        src="/assets/images/image.png" // Ensure this path is correct relative to the public directory
        className="absolute z-0 object-cover" // z-0 is correct for putting it behind relative content
        priority
        quality={100} // Optional: for better quality
      />
      <p className="relative z-10">Header</p> {/* Text stays above the image */}
    </div>
  );
}