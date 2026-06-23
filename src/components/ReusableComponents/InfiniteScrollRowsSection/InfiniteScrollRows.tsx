import React from "react";

const ltrimages = [
  "/ltr-frame.png",
  "/ltr-frame-1.png",
  "/ltr-frame-2.png",
  "/ltr-frame-3.png",
  "/ltr-frame-4.png",
  "/ltr-frame-5.png",
  "/ltr-frame-6.png",
  "/ltr-frame-7.png",
  "/ltr-frame-8.png",
  "/ltr-frame-9.png",
  "/ltr-frame-10.png",
  "/ltr-frame-11.png",
  "/ltr-frame-12.png",
  "/ltr-frame-13.png",
  "/ltr-frame-14.png",
  "/ltr-frame-15.png",
  "/ltr-frame-16.png",
];

const rtlimages = [
  "/rtl-frame.png",
  "/rtl-frame-1.png",
  "/rtl-frame-2.png",
  "/rtl-frame-3.png",
  "/rtl-frame-4.png",
  "/rtl-frame-5.png",
  "/rtl-frame-6.png",
  "/rtl-frame-7.png",
  "/rtl-frame-8.png",
  "/rtl-frame-9.png",
  "/rtl-frame-10.png",
  "/rtl-frame-11.png",
  "/rtl-frame-12.png",
  "/rtl-frame-13.png",
  "/rtl-frame-14.png",
  "/rtl-frame-15.png",
  "/rtl-frame-16.png",
];
// repeat images 6 times (you can increase if needed)
const ltrrepeatedImages = Array(2).fill(ltrimages).flat();
const rtlrepeatedImages = Array(2).fill(rtlimages).flat();

export default function InfiniteScrollRows() {
  return (
    <div className="w-full overflow-hidden space-y-5">

      {/* Row 1 - LTR */}
      <div className="overflow-hidden">
        <div className="flex w-max animate-scrollLTR gap-5">
          {ltrrepeatedImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="brand"
              className="w-[100px] md:w-[156px] object-contain flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Row 2 - RTL */}
      <div className="overflow-hidden">
        <div className="flex w-max animate-scrollRTL gap-5">
          {rtlrepeatedImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="brand"
              className="w-[100px] md:w-[156px] object-contain flex-shrink-0"
            />
          ))}
        </div>
      </div>

    </div>
  );
}

