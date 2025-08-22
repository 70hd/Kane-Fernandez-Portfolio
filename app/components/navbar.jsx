import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="sticky top-0  z-50 border-[#121212]/25 border-b-[.5px] w-full justify-between bg-white text-[#121212] h-fit flex x-dynamic-padding py-6 items-start">
      <Link href={"/"}>
        <h2>Kane Fernandez</h2>
      </Link>
      <Link href={"https://linktr.ee/kanehfernandez"} target="_blank">
      <Image
      src={"/linktree.svg"}
      width={24}
      height={48}
      alt="linktree"
      className="flex-1 h-full"
      />
      </Link>
    </div>
  );
};
export default Navbar;
