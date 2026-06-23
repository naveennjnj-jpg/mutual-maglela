import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "iconoir-react";
import "swiper/css";
import "swiper/css/navigation";
import Screenshorts1 from "@/assets/screenshorts-1.jpg";
import Screenshorts2 from "@/assets/screenshorts-2.jpg";
import Screenshorts3 from "@/assets/screenshorts-3.jpg";

// --------------------
// TESTIMONIAL DATA
// --------------------
const storeData = [
  {
    id: 1,
    image: Screenshorts1,
},
  {
    id: 2,
    image: Screenshorts2,
},
  {
    id: 3,
    image: Screenshorts3,
 },
    {
    id: 4,
    image: Screenshorts1,
 },
];
interface ScreenshortsSliderProps {
  id: string;
}
// --------------------
// COMPONENT
// --------------------
export default function ScreenshortsSlider({ id }: ScreenshortsSliderProps) {
  return (
    <section className="overflow-hidden py-10 md:py-14 lg:py-20">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        {/* HEADER */}
        <div className="flex gap-3 items-center justify-between mb-7">
          <h2 className="text-Black_light text-2xl md:text-3xl font-bold">
           Screenshots
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
            320: { slidesPerView: 1, spaceBetween: 5 },
            640: { slidesPerView: 2, spaceBetween: 5 },
            1024: { slidesPerView: 3, spaceBetween: 5 }, 
          }}
        >
          {storeData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="flex flex-col relative">
                {/* AVATAR */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.image}
                    className="w-full aspect-[1/0.6] object-cover "
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
