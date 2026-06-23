import React from "react";

type VideoSectionProps = {
  videoSrc: string;
  title: React.ReactNode;
  description: string;
};

const VideoSection: React.FC<VideoSectionProps> = ({
  videoSrc,
  title,
  description,
}) => {
  return (
    <section className="py-10 md:py-14 lg:py-20">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-5 md:gap-7 items-center">
          <div className="w-full ">
            <video
              className="w-full object-cover rounded-2xl md:rounded-[28.10px]"
              controls
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="self-stretch justify-start text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              {title}
            </h2>
            <p className="text-paragraph text-sm font-normal leading-[26px]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
