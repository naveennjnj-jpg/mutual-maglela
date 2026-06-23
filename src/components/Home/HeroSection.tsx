import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HeroSectionIcon } from "@/utils/svgicons";
import HeroLogo from "@/assets/home/hero-banner.webp";


const HeroSection = () => {
    return (
        <section className="relative h-[780px] overflow-hidden -mt-20">
            {/* Background Image */}
            <img
                src={HeroLogo}
                alt="Johannesburg city skyline"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/92 via-[#1C1C1C]/75 to-transparent"></div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/50 via-transparent to-transparent"></div>

            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        "radial-gradient(at 20% 65%, rgb(200, 90, 50) 0%, transparent 55%)",
                }}
            />

            {/* Content */}
            <div className="relative h-full max-w-[1200px] mx-auto px-6 lg:px-8 flex flex-col justify-center pt-20">
                <div className="max-w-2xl">
                    {/* Google Reviews */}
                    <a
                        href="https://www.google.com/search?q=Magalela+Media+reviews"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs px-4 py-1.5 rounded-full mb-5 hover:bg-white/20 transition-colors"
                    >
                        <HeroSectionIcon />

                        4.9 from 176 Google Reviews
                    </a>

                    {/* Heading */}
                    <h1 className="text-3xl md:text-[40px] font-['Roboto'] text-white mb-4 leading-[1.2]">
                        Magalela Media is a Strategic
                        <br />
                        Communication Agency
                        <br />
                        based in Johannesburg.
                    </h1>

                    {/* Description */}
                    <p className="text-white/70 text-sm md:text-base leading-relaxed mb-7 max-w-xl">
                        We transform complex research, data, and insights into high-impact
                        messaging. By combining advanced AI tools with expert human
                        strategy, Magalela helps leaders and change-makers communicate with
                        clarity, authority, and purpose.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white px-6 py-3 rounded-xl font-semibold transition-colors text-sm"
                        >
                            Get Free Access
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            to="/services"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm backdrop-blur-sm"
                        >
                            Request a Demo
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6">
                        <div>
                            <p className="text-white font-bold text-base leading-none">
                                150+
                            </p>
                            <p className="text-white/50 text-xs mt-0.5">
                                Institutions Served
                            </p>
                        </div>

                        <div>
                            <p className="text-white font-bold text-base leading-none">
                                500+
                            </p>
                            <p className="text-white/50 text-xs mt-0.5">
                                Projects Delivered
                            </p>
                        </div>

                        <div>
                            <p className="text-white font-bold text-base leading-none">
                                98%
                            </p>
                            <p className="text-white/50 text-xs mt-0.5">
                                Client Satisfaction
                            </p>
                        </div>

                        <div>
                            <p className="text-white font-bold text-base leading-none">
                                15+
                            </p>
                            <p className="text-white/50 text-xs mt-0.5">
                                Years Experience
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;