import NavHeroSection from "@/components/ReusableComponents/NavPageHeroSection/NavHeroSection";
import ScreenshortsSlider from "@/components/ReusableComponents/ScreenshortsSlider/ScreenshortsSlider";
import Faq from "@/components/ReusableComponents/FAQSection/FaqSection";
import TopFooterSection from "@/components/ReusableComponents/TopFooterSection/TopFooterSection";
import { Button } from "@/components/ui/button";
import InnerPage from "@/assets/inner-page.jpg";
import TrainingImage from "@/assets/training-image.png";
import type { ApplicationSupportContent } from "@/data/applicationSupport";
import { getSubscriptionUrl } from "@/utils/links";
import type { CourseKey } from "@/components/ReusableComponents/PlanSection/plans";

type ApplicationSupportPageProps = {
  content: ApplicationSupportContent;
};

const ApplicationSupportPage = ({ content }: ApplicationSupportPageProps) => {
  const title = content.title.toLowerCase();
  const courseKey: CourseKey = title.includes("pmi-rmp")
    ? "PMI-RMP"
    : title.includes("pmocp")
      ? "PMOCP"
      : title.includes("pgmp")
        ? "PgMP"
        : title.includes("pfmp")
          ? "PfMP"
          : "PMP";

  return (
    <>
      <NavHeroSection
        title={content.title}
        description={content.heroDescription}
        descriptionsecond=""
        sideImage={InnerPage}
      />

      <section className="py-10 md:py-14 lg:py-20">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-5 lg:gap-10 items-start">
            <div>
              <h2 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px]">
                {content.heading}
              </h2>
              {content.introNote && (
                <p className="text-primary_heading text-sm md:text-base font-semibold leading-[26px] mt-3">
                  {content.introNote}
                </p>
              )}
              <div className="space-y-2 mt-3">
                {content.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-paragraph text-sm font-normal leading-[26px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <img
                src={TrainingImage}
                alt={`${content.title} training support`}
                className="rounded-3xl w-full object-cover"
              />
              <div className="bg-light-blue rounded-[20px] p-6 md:p-7 text-center">
                <p className="text-paragraph text-sm font-medium">
                  Application Support Package
                </p>
                <div className="text-primary_heading text-3xl md:text-4xl font-bold mt-2">
                  {content.price}
                </div>
                <Button className="mt-5 w-full" asChild>
                  <a href={getSubscriptionUrl(courseKey)}>Enroll Now</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="-mt-10 md:-mt-20 relative">
        <ScreenshortsSlider id="application-screenshot" />
      </div>
      <div className="-mt-10 md:-mt-20 relative">
        <Faq faqs={content.faqs} hideButton />
      </div>
      <TopFooterSection />
    </>
  );
};

export default ApplicationSupportPage;
