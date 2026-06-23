import React from "react";
import FreeTralBg from "@/assets/free-trail-bg.jpg";
import FreeTrailImage from "@/assets/free-trail-img.jpg";
import { Button } from "../../ui/button";
import { getSubscriptionUrl } from "@/utils/links";
import type { CourseKey } from "../PlanSection/plans";

interface StartFreeTrialProps {
  headings?: string;
  description?: string;
  features?: string[];
  buttonText?: string;
  courseKey?: CourseKey;
}

const StartFreeTrial: React.FC<StartFreeTrialProps> = ({
  headings = "Start Your Free Trial",
  description =
    "Test-drive our Exam Simulators, Practice Exams, and study bundles before you buy.",
  features = [
    "Explore exam prep tools, self-paced resources, and practice tests",
    "Real exam-style simulation with performance insights",
    "Detailed explanations and domain-wise analytics",
    "No credit card required for trial access",
  ],
  buttonText = "Try for Free",
  courseKey = "PMP",
}) => {
  return (
    <section className="overflow-hidden py-10 md:py-14 lg:py-20">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <div
          style={{
            backgroundImage: `url(${FreeTralBg})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className="py-5 p-4 lg:px-10 lg:py-5 rounded-[20px] text-white flex flex-wrap gap-5 justify-between items-center"
        >
          <div className="flex flex-col gap-5 items-start">
            <h2 className="text-white text-2xl font-bold">{headings}</h2>

            <p className="text-white text-sm md:text-base font-normal max-w-md w-full">
              {description}
            </p>

            <ul className="space-y-2">
              {features.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-white text-sm font-normal leading-6"
                >
                  <span className="text-[8px]">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Button className="max-h-[44px] !bg-white !text-primary_blue" asChild>
              <a href={getSubscriptionUrl(courseKey)}>{buttonText}</a>
            </Button>
          </div>

          <img
            src={FreeTrailImage}
            alt="FreeTrial"
            className="max-w-[463px] w-full rounded-[20px]"
          />
        </div>
      </div>
    </section>
  );
};

export default StartFreeTrial;
