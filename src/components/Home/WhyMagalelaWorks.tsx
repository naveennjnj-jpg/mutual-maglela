import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const WhyMagalelaWorks = () => {
  // Features data array
  const features = [
    {
      id: 1,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9.75 5.75V9.75L12.75 12.75M18.75 9.75C18.75 10.9319 18.5172 12.1022 18.0649 13.1942C17.6126 14.2861 16.9497 15.2782 16.114 16.114C15.2782 16.9497 14.2861 17.6126 13.1942 18.0649C12.1022 18.5172 10.9319 18.75 9.75 18.75C8.5681 18.75 7.39778 18.5172 6.30585 18.0649C5.21392 17.6126 4.22177 16.9497 3.38604 16.114C2.55031 15.2782 1.88738 14.2861 1.43508 13.1942C0.98279 12.1022 0.75 10.9319 0.75 9.75C0.75 7.36305 1.69821 5.07387 3.38604 3.38604C5.07387 1.69821 7.36305 0.75 9.75 0.75C12.1369 0.75 14.4261 1.69821 16.114 3.38604C17.8018 5.07387 18.75 7.36305 18.75 9.75Z"
            stroke="#C85A32"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconBg: "rgba(200, 90, 50, 0.1)",
      iconBorder: "rgb(200, 90, 50)",
      title: "Streamlined Insights for Time-Strapped Experts",
      description:
        "You already have the industry knowledge; you just don't have the hours. We do the heavy lifting to turn complex data into clear, actionable summaries.",
    },
    {
      id: 2,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5.75001 8.75H5.76001M9.75001 8.75H9.76001M13.75 8.75H13.76M18.75 8.75C18.75 13.168 14.72 16.75 9.75001 16.75C8.27861 16.755 6.8248 16.4308 5.49501 15.801L0.750011 16.75L2.14501 13.03C1.26201 11.792 0.750011 10.324 0.750011 8.75C0.750011 4.332 4.78001 0.75 9.75001 0.75C14.72 0.75 18.75 4.332 18.75 8.75Z"
            stroke="#0A734C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconBg: "rgba(0, 106, 66, 0.1)",
      iconBorder: "rgb(0, 106, 66)",
      title: "Built for Real-World Communication",
      description:
        "We specialise in research and science communication, translating dense academic data into engaging narratives. We help bridge the gap between academia and public engagement so your ideas can make a real-world impact.",
    },
    {
      id: 3,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M2.75 0.75V4.75M0.75 2.75H4.75M3.75 14.75V18.75M1.75 16.75H5.75M10.75 0.75L13.036 7.607L18.75 9.75L13.036 11.893L10.75 18.75L8.464 11.893L2.75 9.75L8.464 7.607L10.75 0.75Z"
            stroke="#9939ED"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconBg: "rgba(153, 57, 237, 0.1)",
      iconBorder: "rgb(153, 57, 237)",
      title: "AI Speed Meets Human Expertise, Results You Can Trust",
      description:
        "Scale your workflow without sacrificing quality. By combining the lightning-fast efficiency of artificial intelligence with the nuanced depth of human review, we deliver outputs that are 100% accurate, highly credible, and truly meaningful to your audience.",
    },
    {
      id: 4,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M16.75 18.75V2.75C16.75 2.21957 16.5393 1.71086 16.1642 1.33579C15.7891 0.96071 15.2804 0.75 14.75 0.75H4.75C4.21957 0.75 3.71086 0.96071 3.33579 1.33579C2.96071 1.71086 2.75 2.21957 2.75 2.75V18.75M16.75 18.75H18.75M16.75 18.75H11.75M2.75 18.75H0.75M2.75 18.75H7.75M11.75 18.75V13.75C11.75 13.4848 11.6446 13.2304 11.4571 13.0429C11.2696 12.8554 11.0152 12.75 10.75 12.75H8.75C8.4848 12.75 8.2304 12.8554 8.0429 13.0429C7.8554 13.2304 7.75 13.4848 7.75 13.75V18.75M11.75 18.75H7.75M6.75 4.75H7.75M6.75 8.75H7.75M11.75 4.75H12.75M11.75 8.75H12.75"
            stroke="#AC7E1A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconBg: "rgba(172, 126, 26, 0.1)",
      iconBorder: "rgb(172, 126, 26)",
      title: "Enterprise Communication Platform for Institutions & Leaders",
      description:
        "Built for scale and security. From top-tier universities to global enterprises, our tailored communication software empowers leaders to flawlessly manage high-stakes, strategic messaging.",
    },
    {
      id: 5,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M10.75 0.75H18.75M18.75 0.75V8.75M18.75 0.75L10.75 8.75L6.75 4.75L0.75 10.75"
            stroke="#CC235E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconBg: "rgba(204, 35, 94, 0.1)",
      iconBorder: "rgb(204, 35, 94)",
      title: "Scalable Platform for Institutions & Academics",
      description:
        "Future-proof your workflows with a platform designed to scale. Whether you are an independent researcher, a growing lab, or an enterprise-level institution, our AI Writing Tools expand seamlessly to meet your complex needs.",
    },
    {
      id: 6,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M6.75 9.806L8.75 11.806L12.75 7.806M18.368 3.79C15.2061 3.95792 12.1067 2.86461 9.75 0.75C7.39327 2.86461 4.2939 3.95792 1.132 3.79C0.877534 4.77511 0.749174 5.78855 0.750004 6.806C0.750004 12.397 4.574 17.096 9.75 18.428C14.926 17.096 18.75 12.398 18.75 6.806C18.75 5.764 18.617 4.754 18.368 3.79Z"
            stroke="#1A2B4C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconBg: "rgba(26, 43, 76, 0.1)",
      iconBorder: "rgb(26, 43, 76)",
      title: "Ironclad Security You Can Trust",
      description:
        "We safeguard your data, research, and institutional IP with rigorous security protocols and uncompromising editorial standards.",
    },
  ];

  return (
    <section
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(165.661deg, rgba(248, 249, 252, 0.95) 8.3013%, rgba(255, 255, 255, 0.95) 91.699%)",
      }}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"></div>

      <div className="max-w-[1520px] mx-auto px-[89px] relative">
        {/* Header Section */}
        <div className="mb-[36px]">
          <div className="flex items-center gap-[2px] mb-[11px]">
            <svg
              width="38"
              height="2"
              viewBox="0 0 38 2"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M1 1H37"
                stroke="#C85A32"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="font-['Roboto'] font-medium text-[14px] text-[#C85A32] uppercase tracking-[0.05em]">
              Engineered for High-Stakes Communication
            </p>
          </div>
          <h2 className="font-['Roboto'] font-normal text-[42px] leading-[52px] text-[#111] mb-[14px]">
            Why Magalela Media Works for You
          </h2>
          <p className="font-['Roboto'] font-normal text-base leading-[28px] text-[#6B7280] max-w-[560px]">
            Deep Expertise, Delivered Fast: We Turn Complex Topics into Clear
            Insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-[4px] p-4 relative border border-[#E5E8EC]"
              style={{ minHeight: "214px" }}
            >
              {/* Icon Container */}
              <div
                className="w-[50px] h-[50px] rounded-[4px] flex items-center justify-center mb-[18px] relative"
                style={{
                  backgroundColor: feature.iconBg,
                  border: `0.8px solid ${feature.iconBorder}`,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="relative"
                >
                  {feature.icon.props.children}
                </svg>
              </div>

              {/* Title */}
              <h3 className="font-['Roboto'] font-semibold text-base tracking-[0.164px] text-[#1C1C1C] mb-[10px] leading-normal">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="font-['Roboto'] font-normal text-[14px] leading-[22px] text-[#6B7280]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive has-[>svg]:px-4 bg-[#1A2B4C] hover:bg-[#1A2B4C]/90 text-white h-[52px] px-8 rounded-lg font-['Roboto'] font-medium text-[15px] transition-transform hover:scale-[1.02] shadow-md flex items-center gap-2"
          >
            Create a Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyMagalelaWorks;