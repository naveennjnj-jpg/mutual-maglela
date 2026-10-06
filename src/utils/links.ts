export const CALENDLY_CONSULTATION_URL = "YOUR_CALENDLY_URL";

export const SHOPIFY_TRAINING_LINKS = {
  PMP: "YOUR_PMP_URL",
  PgMP: "YOUR_PGMP_URL",
  PfMP: "YOUR_PFMP_URL",
  PMOCP: "YOUR_PMIOCP_URL",
  "PMI-RMP": "YOUR_PMI_RMP_URL",
};

export const isExternalUrl = (url: string): boolean => {
  return /^https?:\/\//i.test(url);
};