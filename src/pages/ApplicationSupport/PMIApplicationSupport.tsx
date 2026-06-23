import ApplicationSupportPage from "@/components/ApplicationSupport/ApplicationSupportPage";
import { applicationSupportContent } from "@/data/applicationSupport";

const PMIApplicationSupport = () => {
  return <ApplicationSupportPage content={applicationSupportContent.other} />;
};

export default PMIApplicationSupport;
