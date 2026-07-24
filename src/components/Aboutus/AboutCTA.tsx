import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AboutCTA = () => {
  const images = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1609436132311-e4b0c9370469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&q=80",
      alt: "Team member",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1573496130141-209d200cebd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&q=80",
      alt: "Team member",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1609371497456-3a55a205d5eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&q=80",
      alt: "Team member",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&q=80",
      alt: "Team member",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&q=80",
      alt: "Team member",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&q=80",
      alt: "Team member",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Column - Content */}
          <div className="lg:w-2/5 shrink-0">
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">
              Join Our Network
            </p>
            <h2 className="text-2xl md:text-[34px] font-['Roboto'] text-[#1C1C1C] leading-[1.2] mb-5">
              Ready to Elevate Your Institutional Communication?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Join academics, universities, research networks, and development
              organisations that trust Magalela Media for strategic
              communications excellence across Africa.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Start a Conversation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Column - Image Grid */}
          <div className="lg:w-3/5">
            <div className="grid grid-cols-3 gap-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square rounded-2xl overflow-hidden"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;