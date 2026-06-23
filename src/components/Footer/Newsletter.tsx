import React from "react";
import { Button } from "../ui/button";

export default function Newsletter() {
  return (
    <div className="footer-newsletter">
      <div className="self-stretch py-8 px-4 md:!p-10 bg-white/5 rounded-[20px] flex justify-between items-center flex-col lg:flex-row gap-5">
        <p className="max-w-[400px] w-full justify-start text-white text-base font-normal leading-[26px] lg:leading-[30px] text-center lg:text-left">
          Subscribe to our newsletter to received product update and promotions
        </p>
        <div className="grid grid-cols-[1fr] sm:grid-cols-[1fr_131px] justify-start items-center gap-2.5 max-w-[394px] w-full">
          <input
            type="text"
            placeholder="Email Address..."
            className="w-full h-11 text-light-blue py-3 px-4 bg-transparent rounded-[30px] outline outline-1 outline-offset-[-1px] outline-[#F0F8FF80] text-xs font-normal leading-6"
          />
          <Button>Submit</Button>
        </div>
      </div>
    </div>
  );
}
