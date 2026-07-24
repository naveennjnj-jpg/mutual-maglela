import React from "react";

interface ChallengeProps {
  badge?: string;
  title?: string;
  description?: string;
  challenges?: Array<{
    id: number;
    title: string;
    description: string;
  }>;
}

const Challenge = ({
  badge = "The Challenge",
  title = "Your Research Deserves a Bigger Audience",
  description = "Groundbreaking research often sits behind paywalls and conference halls, invisible to the policymakers, practitioners, and publics who could benefit most. The challenge is not the quality of the work — it is communicating it in language that resonates beyond academia.",
  challenges: propChallenges,
}: ChallengeProps) => {
  const defaultChallenges = [
    {
      id: 1,
      title: "Translation Gap",
      description:
        "Complex findings are often communicated in language that only peers can decode, limiting public and policy uptake.",
    },
    {
      id: 2,
      title: "Limited Media Visibility",
      description:
        "Without strategic media engagement, even the most significant research rarely reaches mainstream audiences or decision-makers.",
    },
    {
      id: 3,
      title: "No Clear Narrative",
      description:
        "Researchers struggle to frame their work around the 'so what?' question that journalists, funders, and policymakers need answered.",
    },
    {
      id: 4,
      title: "Funder Communication",
      description:
        "Grant reporting and funder communications require clear, evidence-based storytelling that demonstrates measurable impact.",
    },
    {
      id: 5,
      title: "Reputational Risk",
      description:
        "Controversial findings or politically sensitive topics require careful media strategy to protect both researcher and institution.",
    },
    {
      id: 6,
      title: "Digital Presence",
      description:
        "Most researchers lack an intentional online presence that communicates authority and makes their work discoverable.",
    },
  ];

  const challenges = propChallenges || defaultChallenges;

  return (
    <section className="py-20 lg:py-24 bg-[#F9F7F4]">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#C85A32] text-xs font-semibold tracking-[0.15em] uppercase mb-3">
            {badge}
          </p>
          <h2 className="text-3xl lg:text-[40px] font-['Roboto'] text-[#1C1C1C] mb-5 leading-tight">
            {title}
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="w-8 h-0.5 bg-[#C85A32] mb-5"></div>
              <h3 className="font-semibold text-[#1C1C1C] text-base mb-3 leading-snug">
                {challenge.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {challenge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Challenge;