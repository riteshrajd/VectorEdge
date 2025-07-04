import React from "react";

export default function page() {
  return (
    <div>
      <div className="bg-gray-800 text-white w-full h-fit wrap-anywhere flex justify-center">header</div>
      <div className="flex h-screen">
        <div className=" bg-zinc-800 text-zinc-200 w-full h-full">sidebar left</div>
        <div className=" bg-zinc-700 flex flex-col text-white/80 w-full h-full">
          maincontent
          <button className="bg-red-900">Toggle theme</button>
        </div>
        <div className="bg-stone-800 text-white/70 w-full h-full">sidebar right</div>
      </div>
    </div>
  );
}
