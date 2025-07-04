import Image from "next/image";
import React from "react";

export default function Header() {
  return (
    <div
      className="relative font-roboto font-extralight text-white h-12 w-full flex items-center justify-center p-2 overflow-clip"
      // style={{ position: "relative" }} // 'relative' is already in className, no need for inline style unless overriding
    >
      <Image
        alt="Background gradient"
        fill // Fills the parent container
        src="/assets/images/image.png" // Ensure this path is correct relative to the public directory
        className="absolute -z-10 object-cover brightness-120" // z-0 is correct for putting it behind relative content
        priority
        quality={100} // Optional: for better quality
      />
      <p className="relative z-10">Pro Launching Soon - Prebook and get upto 60% off</p> {/* Text stays above the image */}
    </div>
  );
}