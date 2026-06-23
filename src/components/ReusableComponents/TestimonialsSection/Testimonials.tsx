import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "iconoir-react";
import "swiper/css";
import "swiper/css/navigation";

// --------------------
// TESTIMONIAL DATA
// --------------------
const storeData = [
  {
    id: 1,
    name: "Kathrin R",
    role: "CEO",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    description:
      "I couldn't be happier with this hair growth spray. It arrived on time, and it has exceeded my expectations. With consistent morning and evening application, I've already witnessed a visible transformation after just 2 weeks!",
  },
  {
    id: 2,
    name: "Albert",
    role: "Manager",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    description:
      "I couldn't be happier with this hair growth spray. It arrived on time, and it has exceeded my expectations. With consistent morning and evening application, I've already witnessed a visible transformation after just 2 weeks!",
  },
  {
    id: 3,
    name: "John",
    role: "Sales",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    description:
      "I couldn't be happier with this hair growth spray. It arrived on time, and it has exceeded my expectations. With consistent morning and evening application, I've already witnessed a visible transformation after just 2 weeks!",
  },
    {
    id: 4,
    name: "Kathrin R",
    role: "CEO",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    description:
      "I couldn't be happier with this hair growth spray. It arrived on time, and it has exceeded my expectations. With consistent morning and evening application, I've already witnessed a visible transformation after just 2 weeks!",
  },
];
interface TestimonialsProps {
  id: string;
}
// --------------------
// COMPONENT
// --------------------
export default function Testimonials({ id }: TestimonialsProps) {
  return (
    <section className="overflow-hidden py-10 md:py-14 lg:py-20 bg-light-blue rounded-[20px] md:rounded-[40px] lg:rounded-[60px]">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        {/* HEADER */}
        <div className="flex gap-3 items-center justify-between mb-10">
          <h2 className="text-Black_light text-2xl md:text-3xl font-bold">
            Testimonials
          </h2>

          {/* ARROWS */}
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

      {/* SLIDER */}
      <div className="mt-5 max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: `.store-prev-${id}`,
            nextEl: `.store-next-${id}`,
          }}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 12 },
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
        >
          {storeData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white rounded-2xl px-4 md:px-7 pb-6 md:pb-10 h-full flex flex-col relative mt-[40px] md:mt-[52px]">
                {/* AVATAR */}
                <div className="relative -mt-[40px] md:-mt-[52px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[80px] h-[80px] md:w-[104px] md:h-[104px] rounded-full object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="pt-4 md:pt-5">
                  {/* STARS */}
                  <div className="flex gap-1 mb-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <span key={i} className="text-[#e09900] text-lg">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* NAME */}
                  <h3 className="font-semibold text-lg lg:text-xl text-Black_light">
                    {item.name}
                  </h3>

                  {/* ROLE */}
                  <p className="text-paragraph text-sm lg:text-base font-normal mb-3">
                    {item.role}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="text-sm lg:text-base text-paragraph leading-[26px] lg:leading-[30px]">
                    {item.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
