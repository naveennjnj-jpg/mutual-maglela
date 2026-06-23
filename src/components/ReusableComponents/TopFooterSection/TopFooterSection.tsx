import { Button } from "@/components/ui/button";
import React from "react";
import { getSubscriptionUrl } from "@/utils/links";

interface FooterContent {
  title: React.ReactNode;
  description: React.ReactNode;
  pointsIntro?: string;
  pointsHeading?: React.ReactNode;
  points: string[];
  buttonText: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

interface TopFooterSectionProps {
  content?: FooterContent;
}

const TopFooterSection: React.FC<TopFooterSectionProps> = ({ content }) => {
  const defaultContent: FooterContent = {
    title: (
      <>
        Unlock Better
        <br />
        Project Management Roles
      </>
    ),
    description:
      "The vCare PMP Exam Prep Course helps you build real-world project management skills while preparing you to confidently clear the PMP® certification exam on your first attempt.",
    points: [
      "PMP-certified professionals earn higher salaries",
      "Stand out in competitive PM roles",
      "Qualify for senior project leadership positions",
      "Prove your project management expertise globally",
    ],
    buttonText: "Start PMP Preparation Today",
    buttonLink: getSubscriptionUrl("PMP"),
  };

  const sectionContent = content || defaultContent;

  return (
    <section className="bg-light-blue py-10 md:py-14 lg:py-20">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.38fr_1fr] gap-5 lg:gap-10 items-center">
          <div>
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
              {sectionContent.title}
            </h2>
            <p className="text-paragraph text-sm font-normal mt-1 max-w-[480px] w-full leading-[26px]">
              {sectionContent.description}
            </p>
          </div>

          <div>
            {sectionContent.pointsIntro && (
              <p className="text-paragraph text-sm font-normal leading-[26px] mb-2">
                {sectionContent.pointsIntro}
              </p>
            )}
            {sectionContent.pointsHeading && (
              <h4 className="text-Black_light text-base md:text-lg font-bold mb-2">
                {sectionContent.pointsHeading}
              </h4>
            )}
            {sectionContent.points.length > 0 && (
              <ul className="space-y-1 list-disc text-paragraph text-sm font-normal leading-[26px] ml-1 mb-5">
                {sectionContent.points.map((point: string, index: number) => (
                  <li key={index} className=" gap-2">
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {sectionContent.buttonLink ? (
                <a href={sectionContent.buttonLink}>
                  <Button variant="outline" className="max-w-[280px] w-full">
                    {sectionContent.buttonText}
                  </Button>
                </a>
              ) : (
                <Button variant="outline" className="max-w-[280px] w-full">
                  {sectionContent.buttonText}
                </Button>
              )}

              {sectionContent.secondaryButtonText &&
                (sectionContent.secondaryButtonLink ? (
                  <a href={sectionContent.secondaryButtonLink}>
                    <Button className="max-w-[280px] w-full">
                      {sectionContent.secondaryButtonText}
                    </Button>
                  </a>
                ) : (
                  <Button className="max-w-[280px] w-full">
                    {sectionContent.secondaryButtonText}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopFooterSection;
