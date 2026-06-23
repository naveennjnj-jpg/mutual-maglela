import type { CourseKey } from "@/components/ReusableComponents/PlanSection/plans";

export const PORTAL_BASE_URL = "https://dharam-user-portal.vercel.app";
export const CALENDLY_CONSULTATION_URL =
  "https://calendly.com/vcareprojectmanagement/30min";

export const COURSE_LABELS: Record<CourseKey, string> = {
  PMP: "PMP",
  PgMP: "PgMP",
  PfMP: "PfMP",
  PMOCP: "PMOCP",
  "PMI-RMP": "PMI-RMP",
};

export const COURSE_SLUGS: Record<CourseKey, string> = {
  PMP: "pmp",
  PgMP: "pgmp",
  PfMP: "pfmp",
  PMOCP: "pmocp",
  "PMI-RMP": "pmi-rmp",
};

export const SHOPIFY_TRAINING_LINKS: Record<CourseKey, string> = {
  PMP: "https://www.vcareprojectmanagement.com/collections/pmp-certification-training",
  PgMP: "https://www.vcareprojectmanagement.com/collections/pgmp-certification-training",
  PfMP: "https://www.vcareprojectmanagement.com/collections/pfmp-certification-training",
  PMOCP: "https://www.vcareprojectmanagement.com/collections/pmocp-certification-training",
  "PMI-RMP":
    "https://www.vcareprojectmanagement.com/collections/pmi-rmp-certification-training",
};

export const SHOPIFY_CLASSROOM_LINKS: Record<CourseKey, string> = {
  PMP: "https://www.vcareprojectmanagement.com/collections/pmp-classroom",
  PgMP: "https://www.vcareprojectmanagement.com/collections/pgmp-classroom",
  PfMP: "https://www.vcareprojectmanagement.com/collections/pfmp-classroom",
  PMOCP: "https://www.vcareprojectmanagement.com/collections/pmocp-classroom",
  "PMI-RMP": "https://www.vcareprojectmanagement.com/collections/pmi-rmp-classroom",
};

export const getCoursePagePath = (
  course: CourseKey,
  page:
    | "exam-prep"
    | "on-demand-course"
    | "exam-simulator"
    | "application-support"
    | "practice-exam"
    | "domains-and-tasks"
    | "flash-cards"
) => `/${COURSE_SLUGS[course]}/${page}`;

const portalUrl = (path: string) =>
  `${PORTAL_BASE_URL}/login?redirect=${encodeURIComponent(path)}`;

export const getSubscriptionUrl = (course: CourseKey) =>
  portalUrl(`/subscriptions?course=${encodeURIComponent(COURSE_LABELS[course])}`);

export const getMockExamUrl = (course: CourseKey) =>
  portalUrl(`/mock-exams?course=${encodeURIComponent(COURSE_LABELS[course])}`);

export const getDashboardUrl = () => portalUrl("/dashboard");

export const isExternalUrl = (href: string) => /^https?:\/\//i.test(href);
