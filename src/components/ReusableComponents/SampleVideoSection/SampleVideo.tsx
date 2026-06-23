import React from "react";

const SampleVideo = () => {
  return (
    <section className="py-10 md:py-14 lg:py-20">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
         <div className=" flex flex-col justify-center items-center mb-6">
                <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px] text-center">Watch Sample PMP Training Videos</h2>
              </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-5 md:gap-7 items-center text-center">
          <div className="w-full ">
            <video
              className="w-full object-cover rounded-2xl md:rounded-[28.10px]"
              controls
            >
              <source
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <h2 className="self-stretch justify-start text-Black_light text-xl md:text-3xl font-bold md:leading-[46px] mt-3 md:mt-5  mb-2">
             Leadership & Team Management
            </h2>
            <p className="text-paragraph text-sm font-normal leading-[26px]">
              Understand leadership styles, team dynamics, and stakeholder engagement.
            </p>
          </div>

         <div className="w-full ">
             <video
              className="w-full object-cover rounded-2xl md:rounded-[28.10px]"
              controls
            >
              <source
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <h2 className="self-stretch justify-start text-Black_light text-xl md:text-3xl font-bold md:leading-[46px] mt-3 md:mt-5 mb-2">
             Work Breakdown Structure (WBS)
            </h2>
            <p className="text-paragraph text-sm font-normal leading-[26px]">
              Learn how work packages translate into activities and schedules.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SampleVideo;
