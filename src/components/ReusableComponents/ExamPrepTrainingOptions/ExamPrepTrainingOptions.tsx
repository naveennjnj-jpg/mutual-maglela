import { Button } from "@/components/ui/button";
import TrainingImage from "@/assets/training-image.png";
import {
  CALENDLY_CONSULTATION_URL,
  SHOPIFY_CLASSROOM_LINKS,
  SHOPIFY_TRAINING_LINKS,
} from "@/utils/links";
import type { CourseKey } from "@/components/ReusableComponents/PlanSection/plans";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Headphones,
  Info,
  Map,
  MonitorPlay,
  Repeat2,
  Target,
  UserRoundCheck,
  Video,
} from "lucide-react";

type TrainingCard = {
  title: string;
  description: string;
  features: string[];
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  recommended?: boolean;
  showBatchRow?: boolean;
};

interface ExamPrepTrainingOptionsProps {
  courseKey: CourseKey;
  bootcampDays: string;
  bootcampAuthorized?: boolean;
  bootcampResource: string;
  classroomFeatures: string[];
  corporateMaterial: string;
}

const getCards = ({
  courseKey,
  bootcampDays,
  bootcampAuthorized,
  bootcampResource,
  classroomFeatures,
  corporateMaterial,
}: ExamPrepTrainingOptionsProps): TrainingCard[] => [
  {
    title: "Online Bootcamp",
    description:
      "Learn from anywhere with live training, expert coaching, and flexible schedules.",
    primaryLabel: "Enroll now",
    primaryHref: SHOPIFY_TRAINING_LINKS[courseKey],
    secondaryLabel: "View all schedules",
    secondaryHref: SHOPIFY_TRAINING_LINKS[courseKey],
    recommended: true,
    showBatchRow: true,
    features: [
      `Choose from intensive ${bootcampDays} or weekly sessions`,
      ...(bootcampAuthorized ? ["PMI Authorized Trainers"] : []),
      "Get flexible pricing options",
      "1:1 mentoring and application support",
      "Full-length mock exams and practice questions",
      bootcampResource,
    ],
  },
  {
    title: "In-Person Training",
    description:
      "Prefer classroom learning? Our in-person bootcamps combine hands-on training, expert instruction, and collaborative learning.",
    primaryLabel: "Enroll now",
    primaryHref: SHOPIFY_CLASSROOM_LINKS[courseKey],
    secondaryLabel: "View all schedules",
    secondaryHref: SHOPIFY_CLASSROOM_LINKS[courseKey],
    showBatchRow: true,
    features: classroomFeatures,
  },
  {
    title: "Corporate Training",
    description:
      "Looking to upskill your team? Our corporate training solutions are tailored to your organization's goals, delivery preferences, and learning requirements.",
    primaryLabel: "View Details",
    primaryHref: "/corporate-training",
    secondaryLabel: "Corporate Enquiry",
    secondaryHref: "/contact-us",
    features: [
      "Customized learning pathways and content",
      "Online, onsite, or hybrid delivery options",
      "Flexible pricing to suit organizational needs",
      corporateMaterial,
      "Enterprise LMS and learner progress dashboards",
      "Dedicated support",
    ],
  },
];

const advisorHeadings: Record<CourseKey, string> = {
  PMP: "Discover PMP® Training Built to Help You Pass",
  PgMP: "Master PgMP® with Training Designed for Success",
  PfMP: "Discover Your Path With PfMP® Training",
  PMOCP: "Discover Your Path With PMI-PMOCP Training",
  "PMI-RMP": "Discover Your Path With PMI-RMP Training",
};

const examNames: Record<CourseKey, string> = {
  PMP: "PMPÂ®",
  PgMP: "PgMPÂ®",
  PfMP: "PfMPÂ®",
  PMOCP: "PMI-PMOCP",
  "PMI-RMP": "PMI-RMPÂ®",
};

const getTrainingHighlights = (examName: string) => [
  {
    icon: MonitorPlay,
    title: "Live Online Training",
    description:
      "Engage in interactive, real-time sessions led by industry experts, ensuring in-depth understanding and instant feedback.",
  },
  {
    icon: Target,
    title: "Real Exam Practice",
    description: `Train with realistic questions and full mock exams that mirror the actual ${examName} exam experience.`,
  },
  {
    icon: Headphones,
    title: "Ongoing Coaching & Support",
    description:
      "Stay accountable with weekly coaching, feedback, and guidance until you pass your exam.",
  },
  {
    icon: UserRoundCheck,
    title: "Mentorship",
    description:
      "1-on-1 plan with a personalised step-by-step study plan and dedicated mentor support tailored to your schedule.",
  },
  {
    icon: Video,
    title: "Video Library",
    description:
      "Access expert-led training recordings anytime - watch, pause, and revisit anytime.",
  },
  {
    icon: ClipboardCheck,
    title: "Application",
    description: `Complete ${examName} application support - from eligibility through to PMI approval.`,
  },
  {
    icon: CalendarDays,
    title: "Flexible Schedule",
    description:
      "Choose from weekday, weekend, daytime, or evening classes to fit your schedule.",
  },
  {
    icon: Repeat2,
    title: "FlexPass",
    description:
      "Change cohorts anytime and continue your learning with a schedule that works for you.",
  },
];

export default function ExamPrepTrainingOptions(props: ExamPrepTrainingOptionsProps) {
  const cards = getCards(props);
  const advisorHeading = advisorHeadings[props.courseKey];
  const trainingHighlights = getTrainingHighlights(examNames[props.courseKey]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">
        {cards.map((card) => (
          <article
            key={card.title}
            className="overflow-hidden rounded-[16px] border-2 border-[#4f93f8] bg-white shadow-sm"
          >
            {card.recommended && (
              <div className="min-h-8 bg-gradient-to-r from-[#8dbefa] to-[#317ff4] text-white text-xs font-bold flex items-center justify-center gap-2">
                <span>Top Recommendations</span>
                <Info size={13} />
              </div>
            )}

            <div className="p-5">
              <h3 className="text-Black_light text-xl font-bold mb-2">
                {card.title}
              </h3>
              <p className="text-paragraph text-sm leading-6 min-h-[72px]">
                {card.description}
              </p>

              <p className="text-Black_light text-2xl font-bold mt-3">
                Coming Soon
              </p>

              <Button asChild className="w-full mt-4 rounded-[8px]">
                <a href={card.primaryHref}>
                  {card.primaryLabel}
                  <ArrowUpRight size={15} />
                </a>
              </Button>

              {card.showBatchRow && card.secondaryHref && card.secondaryLabel && (
                <div className="flex items-center justify-between gap-3 mt-5 text-xs font-bold">
                  <span className="text-Black_light">Batch starting from:</span>
                  <a
                    href={card.secondaryHref}
                    className="text-primary_blue underline underline-offset-2 whitespace-nowrap"
                  >
                    {card.secondaryLabel}
                  </a>
                </div>
              )}

              {!card.showBatchRow && card.secondaryHref && card.secondaryLabel && (
                <a
                  href={card.secondaryHref}
                  className="inline-block text-primary_blue text-xs font-bold underline underline-offset-2 mt-4"
                >
                  {card.secondaryLabel}
                </a>
              )}

              <div className="border-t border-[#e5eefb] my-5" />

              <ul className="space-y-4">
                {card.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-Black_light text-xs font-bold leading-5"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-[#3d8bff] shrink-0 mt-0.5"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <article className="mt-8 mx-auto max-w-[620px] overflow-hidden rounded-[16px] border border-[#4f93f8] bg-white p-5 shadow-sm">
        <img
          src={TrainingImage}
          alt={advisorHeading}
          className="w-full aspect-[2.9/1] object-cover rounded-[12px]"
        />

        <div className="flex items-center gap-5 mt-5">
          <div className="w-12 h-12 rounded-[10px] bg-[#eaf3ff] text-[#3d8bff] flex items-center justify-center shadow-[0_0_0_1px_rgba(79,147,248,0.18)] shrink-0">
            <Map size={24} />
          </div>
          <h3 className="text-Black_light text-xl md:text-2xl font-bold leading-snug">
            {advisorHeading}
          </h3>
        </div>

        <Button asChild variant="outline" className="w-full rounded-[10px] mt-7">
          <a href={CALENDLY_CONSULTATION_URL}>Talk to an Advisor</a>
        </Button>
      </article>

      <section className="mt-10 md:mt-14">
        <div className="flex flex-col items-center text-center mb-6">
          <span className="text-primary_blue text-sm font-bold">
            Training Highlights
          </span>
          <h3 className="text-Black_light text-2xl md:text-3xl font-bold md:leading-[46px] mt-1">
            Everything Included to Keep You Moving
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trainingHighlights.map((highlight) => {
            const Icon = highlight.icon;

            return (
              <article
                key={highlight.title}
                className="rounded-[14px] border border-[#d9e8ff] bg-[#f7fbff] p-5"
              >
                <div className="w-11 h-11 rounded-[10px] bg-white text-[#3d8bff] flex items-center justify-center shadow-sm mb-4">
                  <Icon size={21} />
                </div>
                <h4 className="text-Black_light text-base font-bold mb-2">
                  {highlight.title}
                </h4>
                <p className="text-paragraph text-sm leading-6">
                  {highlight.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
