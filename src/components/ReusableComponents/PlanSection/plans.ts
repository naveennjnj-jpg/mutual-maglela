export interface Plan {
  name: string;
  price: string;
  features: string[];
  popular: boolean;
}

export type CourseKey = "PMP" | "PgMP" | "PfMP" | "PMOCP" | "PMI-RMP";
export type PlanDuration = "1" | "3";

interface CoursePlanByDuration {
  oneMonth: Plan[];
  threeMonth: Plan[];
}

const commonFeatures = [
  "Based on latest Exam Content Outline",
  "Access to highly realistic questions",
  "Detailed answer explanations for every question",
  "Domain-wise performance analytics",
  "Personalized reports and exam dashboard access",
  "Unlimited retakes within your access period",
];

const createPlan = (
  name: string,
  price: string,
  mockExamFeature: string,
  popular = false
): Plan => ({
  name,
  price,
  popular,
  features: [mockExamFeature, ...commonFeatures],
});

export const coursePlans: Record<CourseKey, CoursePlanByDuration> = {
  PMP: {
    oneMonth: [
      createPlan(
        "Essentials",
        "$19.99 | 30-Day Access",
        "1 Full-Length Mock Exam (180 Questions)"
      ),
      createPlan(
        "Advanced",
        "$29.99 | 30-Day Access",
        "3 Full-Length Mock Exams (540 Questions)"
      ),
      createPlan(
        "Elite",
        "$99.99 | 30-Day Access",
        "11 Full-Length Mock Exams (1,980 Questions)",
        true
      ),
    ],
    threeMonth: [
      createPlan(
        "Essentials",
        "$39.99 | 90-Day Access",
        "1 Full-Length Mock Exam (180 Questions)"
      ),
      createPlan(
        "Advanced",
        "$59.99 | 90-Day Access",
        "3 Full-Length Mock Exams (540 Questions)"
      ),
      createPlan(
        "Elite",
        "$199.99 | 90-Day Access",
        "11 Full-Length Mock Exams (1,980 Questions)",
        true
      ),
    ],
  },
  PgMP: {
    oneMonth: [
      createPlan(
        "Essentials",
        "$49.99 | 30-Day Access",
        "1 Full-Length Mock Exam (170 Questions)"
      ),
      createPlan(
        "Advanced",
        "$149.99 | 30-Day Access",
        "5 Full-Length Mock Exams (850 Questions)"
      ),
      createPlan(
        "Elite",
        "$199.99 | 30-Day Access",
        "9 Full-Length Mock Exams (1,530 Questions)",
        true
      ),
    ],
    threeMonth: [
      createPlan(
        "Essentials",
        "$69.99 | 90-Day Access",
        "1 Full-Length Mock Exam (170 Questions)"
      ),
      createPlan(
        "Advanced",
        "$199.99 | 90-Day Access",
        "5 Full-Length Mock Exams (850 Questions)"
      ),
      createPlan(
        "Elite",
        "$299.99 | 90-Day Access",
        "9 Full-Length Mock Exams (1,530 Questions)",
        true
      ),
    ],
  },
  PfMP: {
    oneMonth: [
      createPlan(
        "Essentials",
        "$49.99 | 30-Day Access",
        "1 Full-Length Mock Exam (170 Questions)"
      ),
      createPlan(
        "Advanced",
        "$99.99 | 30-Day Access",
        "3 Full-Length Mock Exams (540 Questions)"
      ),
      createPlan(
        "Elite",
        "$149.99 | 30-Day Access",
        "5 Full-Length Mock Exams (850 Questions)",
        true
      ),
    ],
    threeMonth: [
      createPlan(
        "Essentials",
        "$59.99 | 90-Day Access",
        "1 Full-Length Mock Exam (170 Questions)"
      ),
      createPlan(
        "Advanced",
        "$129.99 | 90-Day Access",
        "3 Full-Length Mock Exams (540 Questions)"
      ),
      createPlan(
        "Elite",
        "$199.99 | 90-Day Access",
        "5 Full-Length Mock Exams (850 Questions)",
        true
      ),
    ],
  },
  PMOCP: {
    oneMonth: [
      createPlan(
        "Essentials",
        "$39.99 | 30-Day Access",
        "1 Full-Length Mock Exam (120 Questions)"
      ),
      createPlan(
        "Advanced",
        "$99.99 | 30-Day Access",
        "3 Full-Length Mock Exams (360 Questions)"
      ),
      createPlan(
        "Elite",
        "$149.99 | 30-Day Access",
        "5 Full-Length Mock Exams (600 Questions)",
        true
      ),
    ],
    threeMonth: [
      createPlan(
        "Essentials",
        "$49.99 | 90-Day Access",
        "1 Full-Length Mock Exam (120 Questions)"
      ),
      createPlan(
        "Advanced",
        "$129.99 | 90-Day Access",
        "3 Full-Length Mock Exams (360 Questions)"
      ),
      createPlan(
        "Elite",
        "$199.99 | 90-Day Access",
        "5 Full-Length Mock Exams (600 Questions)",
        true
      ),
    ],
  },
  "PMI-RMP": {
    oneMonth: [
      createPlan(
        "Essentials",
        "$39.99 | 30-Day Access",
        "1 Full-Length Mock Exam (115 Questions)"
      ),
      createPlan(
        "Advanced",
        "$99.99 | 30-Day Access",
        "3 Full-Length Mock Exams (345 Questions)"
      ),
      createPlan(
        "Elite",
        "$149.99 | 30-Day Access",
        "5 Full-Length Mock Exams (575 Questions)",
        true
      ),
    ],
    threeMonth: [
      createPlan(
        "Essentials",
        "$49.99 | 90-Day Access",
        "1 Full-Length Mock Exam (115 Questions)"
      ),
      createPlan(
        "Advanced",
        "$129.99 | 90-Day Access",
        "3 Full-Length Mock Exams (345 Questions)"
      ),
      createPlan(
        "Elite",
        "$199.99 | 90-Day Access",
        "5 Full-Length Mock Exams (575 Questions)",
        true
      ),
    ],
  },
};

export const getPlansForCourse = (
  course: CourseKey,
  duration: PlanDuration
): Plan[] => (duration === "1" ? coursePlans[course].oneMonth : coursePlans[course].threeMonth);

// Backward-compatible default exports for pages that still expect generic plans.
export const oneMonthPlans: Plan[] = coursePlans.PMP.oneMonth;
export const threeMonthPlans: Plan[] = coursePlans.PMP.threeMonth;
