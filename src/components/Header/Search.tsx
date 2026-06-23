import { SearchIcon } from "@/utils/svgicons";
import React from "react";
const Search = () => {
  return (
    <form className="relative max-w-[162px] w-full">
      <input
        type="text"
        placeholder="What do you want to learn?"
        className=" rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#556378] text-paragraph text-xs font-normal p-2.5 pr-9 w-full"
      />
      <button className="absolute top-1/2 translate-y-[-50%] right-2.5 border-0">
        <SearchIcon />
      </button>
    </form>
  );
};

export default Search;
