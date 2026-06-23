import React from "react";
import GooglePlay from "@/assets/google-play.png";
import ApplePlay from "@/assets/apple.png";
import ScreenImage from "@/assets/screen-image.png";

const DownloadvCare = () => {
  return (
    <section className="bg-light-blue py-10 md:py-14 lg:py-16">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 md:gap-7 items-center">
          <div className="w-full">
            <h2 className="self-stretch justify-start mb-2">
              <span className="text-Black text-2xl md:text-3xl  font-bold md:leading-[46px]">
                Download{" "}
              </span>
              <span className="text-primary_blue text-2xl md:text-3xl  font-extrabold md:leading-[46px]">
                vCare PM Exam Mentor
              </span>
            </h2>
            <div className="flex flex-col gap-2 max-w-[500px] w-full">
              <p className="self-stretch justify-start text-paragraph text-sm font-normal leading-[26px]">
                Take your exam preparation to the next level with the vCare PM
                Exam Mentor app. Access expert learning resources, full-length
                mock exams, targeted practice tests, and interactive flash
                cards—all designed by project management experts, with PMP, PgMP
                and PfMP certificates, to boost your confidence and help you
                succeed. Whether you’re at home or on the go, prep smarter with
                our easy-to-use mobile app.
              </p>
              <p className="self-stretch justify-start text-paragraph text-sm font-normal leading-[26px]">
                1&nbsp;&nbsp; On Demand Courses
              </p>
              <p className="self-stretch justify-start text-paragraph text-sm font-normal leading-[26px]">
                2&nbsp;&nbsp; Mock Exams
              </p>
              <p className="self-stretch justify-start text-paragraph text-sm font-normal leading-[26px]">
                3&nbsp;&nbsp; Practice Tests
              </p>
              <p className="self-stretch justify-start text-paragraph text-sm font-normal leading-[26px]">
                4&nbsp;&nbsp; Flash Cards
              </p>
              <p className="self-stretch justify-start text-paragraph text-sm font-normal leading-[26px]">
                5&nbsp;&nbsp; Available on iOS and Android
              </p>
            </div>
            <p className="self-stretch justify-start text-paragraph text-sm font-normal leading-[26px] mt-2 md:mt-4 max-w-[500px] w-full">
              Download vCare PM Exam Mentor today and get one step closer to your certification—anytime, anywhere!
            </p>
            <div className="flex flex-row gap-3 mt-4 md:mt-7">
              <img
                src={GooglePlay}
                alt="Google Play"
                className="max-w-32 w-full"
              />
              <img
                src={ApplePlay}
                alt="Apple Play"
                className="max-w-32 w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <img
              src={ScreenImage}
              alt="Screen Image"
              className="max-w-[490px] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadvCare;
