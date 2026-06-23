import React from "react";
import TheVcare from "@/assets/thevcar-bg.jpg";
import BgCard from "@/assets/bg-card.jpg";

const ThevCareExam = () => {
  return (
    <section
      className="overflow-hidden py-10 lg:py-12 bg-cover bg-center"
      style={{ backgroundImage: `url(${TheVcare})` }}
    >
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <div className="self-stretch justify-start max-w-[420px] w-full lg:pt-7">
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-[42px] md:leading-[62px]">
            The vCare Exam
          </h2>
          <h1 className="text-white text-3xl md:text-[40px] font-bold leading-[45px] md:leading-[65px]">
            Simulator Advantage
          </h1>
          <h3 className="text-white text-2xl md:text-3xl font-bold leading-[42px] md:leading-[62px]">
            Anytime, Anywhere Access
          </h3>
          <p className="text-white text-sm md:text-base font-normal  leading-[26px] md:leading-[30px] mt-3">
            Use the simulator whenever it suits you and continue your preparation from any location. Study on your laptop or smartphone with the flexibility to learn at your own pace.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-5 mt-7 md:mt-[70px]">
          <div
            className="bg-Black_light rounded-2xl px-3 md:px-5 py-6 md:py-10"
            style={{ backgroundImage: `url(${BgCard})` }}
          >
            <h3 className="self-stretch justify-start text-white text-base md:text-xl font-semibold capitalize leading-6 border-b-[1px] border-white/20 pb-4 mb-4 md:mb-6">
              Award‑winning content
            </h3>
            <p className="text-[#f0f8ff]/80 text-sm font-normal leading-[26px]">
              Every question bank is designed and evaluated by certified
              professionals, ensuring that the explanations align with the most
              current exam content outline. This guarantees that learners
              receive the most relevant and accurate information to prepare
              effectively for their assessments.
            </p>
          </div>
          <div
            className="bg-Black_light rounded-2xl px-3 md:px-5 py-6 md:py-10"
            style={{ backgroundImage: `url(${BgCard})` }}
          >
            <h3 className="self-stretch justify-start text-white text-base md:text-xl font-semibold capitalize leading-6 border-b-[1px] border-white/20 pb-4 mb-4 md:mb-6">
              Always up to date
            </h3>
            <p className="text-[#f0f8ff]/80 text-sm font-normal leading-[26px]">
              We frequently refresh our question pools and exam interface to
              ensure that your practice sessions reflect the latest exam
              experience. This way, you can confidently prepare with materials
              that align with current standards and expectations, enhancing your
              readiness for the actual exam.
            </p>
          </div>
          <div
            className="bg-Black_light rounded-2xl px-3 md:px-5 py-6 md:py-10"
            style={{ backgroundImage: `url(${BgCard})` }}
          >
            <h3 className="self-stretch justify-start text-white text-base md:text-xl font-semibold capitalize leading-6 border-b-[1px] border-white/20 pb-4 mb-4 md:mb-6">
              Risk‑free 30‑day guarantee
            </h3>
            <p className="text-[#f0f8ff]/80 text-sm font-normal leading-[26px]">
              Experience the simulator without any worries! If it doesn’t meet
              your expectations, simply ask for a refund within 30 days. We want
              you to feel confident in your choice, so go ahead and explore
              whether it’s the perfect match for you. Dive in and see how it can
              enhance your experience!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThevCareExam;
