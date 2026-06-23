import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "iconoir-react";
import "swiper/css";
import "swiper/css/navigation";
import { CircleArrowIcon } from "@/utils/svgicons";
import { Button } from "../ui/button";
import { SHOPIFY_TRAINING_LINKS } from "@/utils/links";

// --------------------
// DATA (same style)
// --------------------
const storeData = [
  {
    id: 1,
    title: "PMP®",
    url: SHOPIFY_TRAINING_LINKS.PMP,
    points: [
      "Live, online, mentor-led sessions",
      "Flexibility to reschedule",
      "Training by PMI Authorized instructors.",
      "Access to Digital Materials from PMI",
      "Non-stop Support Until You Pass",
    ],
  },
  {
    id: 2,
    title: "PMI-RMP®",
    url: SHOPIFY_TRAINING_LINKS["PMI-RMP"],
    points: [
      "Live, online, mentor-led sessions",
      "Flexibility to reschedule",
      "Training by PMI Authorized instructors.",
      "Access to Digital Materials from PMI",
      "Non-stop Support Until You Pass",
    ],
  },
  {
    id: 3,
    title: "PMI-RMP®",
    url: SHOPIFY_TRAINING_LINKS.PgMP,
    points: [
      "Live, online, mentor-led sessions",
      "Flexibility to reschedule",
      "Training by PMI Authorized instructors.",
      "Access to Digital Materials from PMI",
      "Non-stop Support Until You Pass",
    ],
  },
  {
    id: 4,
    title: "PMOCP",
    url: SHOPIFY_TRAINING_LINKS.PMOCP,
    points: [
      "Live, online, mentor-led sessions",
      "Flexibility to reschedule",
      "Training by PMI Authorized instructors.",
      "Access to Digital Materials from PMI",
      "Non-stop Support Until You Pass",
    ],
  },
  {
    id: 5,
    title: "PgMP®",
    url: SHOPIFY_TRAINING_LINKS.PgMP,
    points: [
      "Live, online, mentor-led sessions",
      "Training by PMI Certified Experts",
      "Complimentary On-Demand Course",
      "PMI Application and Audit Assistance",
      "Full length exam simulation",
    ],
  },
  {
    id: 6,
    title: "PfMP®",
    url: SHOPIFY_TRAINING_LINKS.PfMP,
    points: [
      "Live, online, mentor-led sessions",
      "Training by PMI Certified Experts",
      "Complimentary On-Demand Course",
      "Free PMI Application and Audit Assistance",
      "Full length exam simulation",
    ],
  },
  {
    id: 7,
    title: "PMI-SP®",
    url: "https://www.vcareprojectmanagement.com/collections/pmi-sp-certification-training",
    points: [
      "Live instructor led sessions",
      "Training by PMI Certified Experts",
      "Flexible Pricing Options",
      "Practice tests for self-assessment",
      "Application and Audit Assistance",
    ],
  },
  {
    id: 8,
    title: "CAPM®",
    url: "https://www.vcareprojectmanagement.com/collections/capm-certification-training",
    points: [
      "Live instructor sessions",
      "Training by PMI Certified Experts",
      "Flexible Pricing Options",
      "Application and Audit Assistance",
      "Practice tests for self-assessment",
    ],
  },
  {
    id: 9,
    title: "PMI-PBA®",
    url: "https://www.vcareprojectmanagement.com/collections/pmi-pba-certification-training",
    points: [
      "Live, online, mentor-led sessions",
      "Training by PMI Certified Experts",
      "Flexible Pricing Options",
      "Application and Audit Assistance",
      "Practice tests for self-assessment",
    ],
  },
];
interface StoreSliderSectionProps {
  id: string;
}
// --------------------
// COMPONENT
// --------------------
export default function StoreSliderSection({ id }: StoreSliderSectionProps) {
  return (
    <section className="overflow-hidden pt-10 md:pt-14 lg:pt-20 pb-5 md:pb-7 lg:pb-10">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <div className="flex gap-3 items-center justify-between">
          <h2 className="text-Black_light text-2xl md:text-3xl font-bold ">
            Our Store
          </h2>

          {/* Custom Arrow Area */}
          <div className="flex gap-2 md:gap-5">
            <button
              className={`store-prev-${id} w-8 h-8 md:w-10 md:h-10 p-2 md:p-3 rounded-full bg-[#4c8dea] text-white flex items-center justify-center`}
            >
              <ArrowLeft />
            </button>

            <button
              className={`store-next-${id} w-8 h-8 md:w-10 md:h-10 p-2 md:p-3 rounded-full bg-[#4c8dea] text-white flex items-center justify-center`}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      <div
        className="mt-5 md:mt-10 pl-3 lg:py-3 md:pl-4
      xl:pl-[calc((100vw-1194px)/2)]"
      >
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          navigation={{
            prevEl: `.store-prev-${id}`,
            nextEl: `.store-next-${id}`,
          }}
          pagination={false}
          breakpoints={{
            320: { slidesPerView: 1.28, spaceBetween: 12 },
            768: { slidesPerView: 2.28, spaceBetween: 16 },
            1024: { slidesPerView: 3.28, spaceBetween: 20 },
          }}
        >
          {storeData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="border border-primary_blue  rounded-2xl px-3 md:px-5 py-6 md:py-10 bg-light-blue h-full flex flex-col justify-between">
                {/* TOP */}
                <div>
                  <h3 className="text-primary_heading font-semibold text-lg mb-3">
                    {item.title}
                  </h3>

                  <div className="border-t border-[#cde2ff] mb-6" />

                  <ul className="space-y-2">
                    {item.points.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-paragraph text-sm"
                      >
                        <span>
                          <CircleArrowIcon />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-[#cde2ff] mt-6" />
                </div>

                {/* BUTTON */}
                <Button className="mt-6 md:mt-10 w-full " asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    Enroll Now
                  </a>
                </Button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
