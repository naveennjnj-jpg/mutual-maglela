import { useState } from "react";
import PlanCard from "./PlanCard";
import { getPlansForCourse, Plan, CourseKey } from "./plans";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getSubscriptionUrl } from "@/utils/links";

type Duration = "1" | "3";

interface PremiumPacksProps {
  showCourseSelect?: boolean;
  courseKey?: CourseKey;
  heading?: string;
  description?: string;
}

export const PremiumPacks = ({
  showCourseSelect = false,
  courseKey,
  heading = "Choose the PMP Exam Prep Plan That Fits You",
  description = "Three flexible plans designed for different learning needs and timelines.",
}: PremiumPacksProps) => {
  const [duration, setDuration] = useState<Duration>("1");
  const [selectedCourse, setSelectedCourse] = useState<CourseKey>(
    courseKey ?? "PMP"
  );

  const activeCourse = showCourseSelect ? selectedCourse : courseKey ?? "PMP";
  const plansToShow = getPlansForCourse(activeCourse, duration);

  const handlePlanSelect = (plan: Plan) => {
    console.log("Selected Plan:", plan);
    window.location.href = getSubscriptionUrl(activeCourse);
  };

  return (
    <section className="overflow-hidden pb-10 md:pb-14 lg:pb-20">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <div
          className={
            showCourseSelect
              ? "text-center"
              : "flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-6"
          }
        >
          {/* LEFT — Title + subtitle */}
          <div className={!showCourseSelect ? "text-center md:text-left" : ""}>
            <h2 className="text-Black_light text-2xl md:text-3xl font-bold ">
              {heading}
            </h2>
            <p className="text-paragraph text-sm font-normal mt-2">
              {description}
            </p>
          </div>

          {/* RIGHT — Filters */}
          <div
            className={
              showCourseSelect
                ? "flex justify-center gap-3 mt-5 md:mt-8"
                : "flex items-center justify-center md:justify-start gap-3"
            }
          >
            {/* Course only on home */}
            {showCourseSelect && (
              <div className="flex flex-col justify-start items-start gap-2">
                <Label>Select Course</Label>
                <Select
                  value={selectedCourse}
                  onValueChange={(value) =>
                    setSelectedCourse(value as CourseKey)
                  }
                >
                  <SelectTrigger className="border-primary_blue text-primary_blue focus:ring-0 rounded-full min-w-32 md:min-w-80">
                    <SelectValue placeholder="PMP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="PMP">
                        Project Management Professional (PMP)
                      </SelectItem>
                      <SelectItem value="PgMP">
                        Program Management Professional (PgMP)
                      </SelectItem>
                      <SelectItem value="PfMP">
                        Portfolio Management Professional (PfMP)
                      </SelectItem>
                      <SelectItem value="PMOCP">
                        PMO Certified Professional (PMI-PMOCP)
                      </SelectItem>
                      <SelectItem value="PMI-RMP">
                        Risk Management Professional (PMI-RMP)
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Always — Duration Selector */}
            <div className="flex flex-col justify-start items-start gap-2">
              <Label>Select Duration</Label>
              <Select
                value={duration}
                onValueChange={(value) => setDuration(value as Duration)}
              >
                <SelectTrigger className="border-primary_blue text-primary_blue focus:ring-0 rounded-full min-w-32 md:min-w-48">
                  <SelectValue placeholder="1 Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-beofre relative pb-5">
        <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto relative">
          {/* ===== Cards ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end  mt-5 md:mt-8">
            {plansToShow.map((plan) => (
              <PlanCard
                key={`${plan.name}-${duration}`}
                plan={plan}
                onSelectPlan={handlePlanSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
