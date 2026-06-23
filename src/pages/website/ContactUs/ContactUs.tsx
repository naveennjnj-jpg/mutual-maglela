import EnquiryForm from '@/components/ReusableComponents/EnquiryForm/EnquiryForm';
import FooterPageHeroSection from '@/components/ReusableComponents/FooterPageHeroSection/FooterPageHeroSection';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const ContactUs = () => {
    const [searchParams] = useSearchParams();
    const subject = searchParams.get("subject") ?? undefined;

    return (
         <>
      <FooterPageHeroSection
        title="Contact Us"
        description=""
      />
      <EnquiryForm defaultSubject={subject} />
      </>
    );
}

export default ContactUs;
