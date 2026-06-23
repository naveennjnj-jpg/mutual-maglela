import React from "react";

export default function Copyright() {
  return (
    <div className="footer-copyright py-6 border-t border-[#787878]">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <div className="self-stretch flex justify-between items-center flex-col lg:flex-row gap-5">
          <p className="max-w-[450px] justify-start text-light-blue text-xs font-normal leading-7 text-center lg:text-left">
            PMP®, PMI®, PMBOK®, CAPM®, PgMP®, PfMP®, PMI-RMP®, PMI-PBA®,
            PMI-RMP®, PMOCP™, PMI-SP® and the PMI Authorized Training Partner
            Logo are registered trademarks of the Project Management Institute,
            Inc.
          </p>
          <p className="text-right justify-start text-light-blue text-xs font-normal leading-7">
            © 2026, vCare Project Management
          </p>
        </div>
      </div>
    </div>
  );
}
