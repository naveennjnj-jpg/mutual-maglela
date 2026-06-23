import { useState, ElementType } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "iconoir-react";
import "swiper/css";
import "swiper/css/navigation";
import { Button } from "../ui/button";

/* =========================
   TYPES
========================= */

export type TabType =
  | "Overview"
  | "What You’ll Access"
  | "How It Works"
  | "You May Also Like";

interface OverviewData {
  heading: string;
  text: string;
}

interface CardItem {
  id: number;
  icon: ElementType;
  title: string;
  description: string;
}

interface WorkData {
  heading: string;
  dis?: string;
  cards: CardItem[];
}

interface SlideItem {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText?: string;
}

interface ContentTabsProps {
  id: string;
  overview: OverviewData;
  access: WorkData;
  work: WorkData;
  alsoLike: {
    heading: string;
    subheading: string;
    slides: SlideItem[];
  };
}

/* =========================
   COMPONENT
========================= */

export default function ContentTabs({
  id,
  overview,
  access,
  work,
  alsoLike,
}: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");

  const tabs: TabType[] = [
    "Overview",
    "What You’ll Access",
    "How It Works",
    "You May Also Like",
  ];

  return (
    <section className="pb-10 lg:pt-10 lg:pb-20">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        {/* ================= Tabs ================= */}
        <div className="flex justify-start md:justify-center gap-1 border-b border-[#dadada] overflow-x-auto whitespace-nowrap px-1 md:px-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-base md:text-lg px-3 md:px-7 border-2 rounded-tl-[10px] rounded-tr-[10px] transition ${
                activeTab === tab
                  ? "text-primary_heading border-primary_heading"
                  : "text-paragraph border-transparent hover:text-primary_heading"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {/* ================= Overview ================= */}
          {activeTab === "Overview" && (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {overview.heading}
              </h2>
              <p className="text-sm leading-6 text-paragraph">
                {overview.text}
              </p>
            </div>
          )}

          {/* ================= What You'll Access ================= */}
          {activeTab === "What You’ll Access" && (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5">
                {access.heading}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {access.cards.map((card) => (
                  <div
                    key={card.id}
                    className="p-5 bg-light-blue rounded-[20px] text-center transition"
                  >
                    <div className="w-[60px] h-[60px] flex items-center justify-center m-auto bg-white rounded-full outline outline-1 outline-[#4c8dea]">
                      <card.icon />
                    </div>

                    <h4 className="text-base md:text-xl font-bold mt-4 mb-2 text-primary_heading">
                      {card.title}
                    </h4>

                    <p className="text-xs leading-6 text-paragraph">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= How It Works ================= */}
          {activeTab === "How It Works" && (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5">
                {work.heading}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {work.cards.map((card) => (
                  <div
                    key={card.id}
                    className="p-5 bg-light-blue rounded-[20px] text-center transition"
                  >
                    <div className="w-[60px] h-[60px] flex items-center justify-center m-auto bg-white rounded-full outline outline-1 outline-[#4c8dea]">
                      <card.icon />
                    </div>

                    <h4 className="text-base md:text-xl font-bold mt-4 mb-2 text-primary_heading">
                      {card.title}
                    </h4>

                    <p className="text-xs leading-6 text-paragraph">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>

              {work.dis && (
                <p className="text-sm mt-6 text-paragraph">{work.dis}</p>
              )}
            </div>
          )}

          {/* ================= You May Also Like ================= */}
          {activeTab === "You May Also Like" && (
            <div>
              <div className="flex gap-3 items-center justify-between mb-7">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {alsoLike.heading}
                  </h2>
                  <p className="text-sm mt-1 text-paragraph">
                    {alsoLike.subheading}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    className={`store-prev-${id} w-10 h-10 rounded-full bg-[#4c8dea] text-white flex items-center justify-center`}
                  >
                    <ArrowLeft />
                  </button>

                  <button
                    className={`store-next-${id} w-10 h-10 rounded-full bg-[#4c8dea] text-white flex items-center justify-center`}
                  >
                    <ArrowRight />
                  </button>
                </div>
              </div>

              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: `.store-prev-${id}`,
                  nextEl: `.store-next-${id}`,
                }}
                spaceBetween={20}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {alsoLike.slides.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    <div>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full aspect-[1/0.72] object-cover rounded-[20px]"
                      />

                      <div className="pt-3 flex flex-col gap-3">
                        <h4 className="text-base font-semibold text-primary_heading">
                          {slide.title}
                        </h4>

                        <p className="text-sm leading-6 text-paragraph">
                          {slide.description}
                        </p>

                        <Button variant="outline" className="w-full">
                          {slide.buttonText ?? "View Details"}
                        </Button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
