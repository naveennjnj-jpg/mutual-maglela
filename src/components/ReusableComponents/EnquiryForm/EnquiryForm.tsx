"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CallIcon, EmailIcon, MapIcon } from "@/utils/svgicons";
import { Label } from "@/components/ui/label";

type SubjectOption = {
  value: string;
  label: string;
};

type EnquiryFormProps = {
  formTitle?: string;
  formDescription?: string;
  defaultSubject?: string;
  subjectOptions?: SubjectOption[];
  showCorporateFields?: boolean;
};

const defaultSubjectOptions: SubjectOption[] = [
  {
    value: "interested-private-training",
    label: "Interested in Private Training",
  },
  {
    value: "interested-corporate-training",
    label: "Interested in Corporate Training",
  },
  {
    value: "upcoming-bootcamps",
    label: "Upcoming Bootcamps & Mentoring Programs",
  },
  { value: "request-a-quote", label: "Request a Quote" },
  { value: "application-support", label: "Application Support" },
  { value: "general-feedback", label: "General Feedback or Questions" },
  { value: "refer-a-friend", label: "Refer a Friend" },
  {
    value: "collaboration-partnership",
    label: "Collaboration / Partnership Opportunities",
  },
  {
    value: "pmi-authorized-training-partner",
    label: "Premier Authorized Training Partner (ATP) of the Project Management Institute",
  },
  { value: "join-team", label: "Interested to Join Our Team" },
  { value: "speaking-webinar", label: "Speaking / Webinar Engagement Request" },
  { value: "other", label: "Other" },
];

const EnquiryForm: React.FC<EnquiryFormProps> = ({
  formTitle = "Enquiry Form",
  formDescription,
  defaultSubject,
  subjectOptions,
  showCorporateFields = false,
}) => {
  const options = useMemo(
    () => subjectOptions ?? defaultSubjectOptions,
    [subjectOptions],
  );

  const initialSubject = options.some(
    (option) => option.value === defaultSubject,
  )
    ? (defaultSubject ?? "")
    : "";

  const [selectedSubject, setSelectedSubject] = useState(initialSubject);

  return (
    <section className="py-10 md:py-14 lg:py-20">
      <div className="max-w-[1226px] w-full px-3 md:px-4 m-auto">
        <div className="bg-light-blue rounded-[20px] grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-5 md:p-10 lg:p-14 px-4 py-7">
          <div>
            <h2 className="text-Black_light text-2xl md:text-3xl md:leading-[46px] font-bold">
              We'd Love to <br /> Hear from You
            </h2>
            <h4 className="text-[#1f1f1f] text-base font-medium leading-6 mt-3">
              vCare Project Management LLC
            </h4>
            <div className="mt-7 space-y-3 text-[#666666]">
              <div className="flex gap-4">
                <div className="flex items-center justify-center size-9 min-w-9 relative bg-[#4c8dea] rounded-[99px] mt-0.5">
                  <MapIcon />
                </div>
                <div>
                  <p className="text-[#666666] text-sm font-normal leading-6">
                    325 N. Saint Paul St. Suite 3100 <br />
                    Dallas TX 75201
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center size-9 min-w-9 relative bg-[#4c8dea] rounded-[99px] mt-0.5">
                  <EmailIcon />
                </div>
                <div className="space-y-1 text-[#666666] text-sm font-normal leading-6">
                  <p>
                    <a
                      href="mailto:info@vcareprojectmanagement.com"
                      className="hover:text-primary_blue transition"
                    >
                      info@vcareprojectmanagement.com
                    </a>
                  </p>
                  <p>
                    <a
                      href="mailto:team@vcareprojectmanagement.com"
                      className="hover:text-primary_blue transition"
                    >
                      team@vcareprojectmanagement.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center size-9 min-w-9 relative bg-[#4c8dea] rounded-[99px] mt-0.5">
                  <CallIcon />
                </div>
                <div className="space-y-1 text-[#666666] text-sm font-normal leading-6">
                  <p>
                    <a
                      href="tel:+19727280388"
                      className="hover:text-primary_blue transition"
                    >
                      +1 972-728-0388
                    </a>
                  </p>
                  <p>
                    <a
                      href="tel:+16502830123"
                      className="hover:text-primary_blue transition"
                    >
                      +1 650-283-0123
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[#4c8dea] text-xl font-bold">{formTitle}</h3>
            {formDescription && (
              <p className="text-paragraph text-sm leading-[26px]">
                {formDescription}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <Label>Subject</Label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="mt-1 h-12 md:h-14 w-full border border-input shadow-none border-[#e4e4e4] p-3 md:p-4 bg-white/80 rounded-full text-[#7a7a7a] text-xs">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Full Name *</Label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  className="mt-1"
                  required
                />
              </div>

              {showCorporateFields && (
                <>
                  <div>
                    <Label>Company Name *</Label>
                    <Input
                      type="text"
                      placeholder="Enter your company name"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label>
                      Number of Team Members to Be Trained (optional)
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Enter number of team members"
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label>Phone Number *</Label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="mt-1"
                  required
                />
              </div>

              {showCorporateFields && (
                <div>
                  <Label>Upload RFP or Supporting Document</Label>
                  <Input type="file" className="mt-1" />
                </div>
              )}

              <div>
                <Label>Your Message</Label>
                <Textarea
                  placeholder="Write your message here..."
                  className="mt-1 w-full shadow-none border border-input border-[#e4e4e4] p-4 bg-white/80 rounded-[10px] text-[#7a7a7a] text-xs min-h-[120px]"
                />
              </div>

              <Button className="w-full !mt-5">Submit</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquiryForm;
