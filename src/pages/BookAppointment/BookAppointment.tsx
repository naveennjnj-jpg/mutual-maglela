import FooterPageHeroSection from "@/components/ReusableComponents/FooterPageHeroSection/FooterPageHeroSection";
import React from "react";
import { Link } from "react-router-dom";
const BookAppointment = () => {
  return (
    <>
      <FooterPageHeroSection title="Book an Appointment" description="" />
      <section className="overflow-hidden pt-10 md:pt-14 lg:pt-20 pb-5 md:pb-7 lg:pb-10">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
          <div
            className="self-stretch text-center justify-start max-w-[1030px] w-full m-auto pb-10 md:pb-0
             text-paragraph text-sm md:text-base font-normal md:leading-[30px]
            "
          >
            <span>
              For any questions related to Project Management career, training,
              and certifications, you can book an obligation free 15 minutes
              session with our CEO{" "}
            </span>
            <Link
              to="https://www.linkedin.com/in/dharamsingh/"
              target="_blank"
              className="text-primary_blue hover:text-primary_heading"
            >
              Mr.Dharam Singh
            </Link>
            <span> using the below booking option</span>
          </div>
          <div className="w-full flex justify-center pb-10">
            <div className="w-full max-w-[1200px] min-h-[1000px] md:min-h-[1000px]">
              <iframe
                src="https://calendly.com/vcareprojectmanagement/30min?embed_domain=www.vcareprojectmanagement.com&embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1"
                width="100%"
                height="100%"
                frameBorder="0"
                title="Calendly Scheduling"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookAppointment;
