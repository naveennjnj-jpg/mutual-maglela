import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Testimonial from "../../../src/components/Common/TestimonialQuote";

describe("TestimonialQuote", () => {
  it("renders nothing when no content and no default brand text override is given", () => {
    const { container } = render(
      <Testimonial quote="" name="" title="" institution="" brandText="" />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the quote wrapped in quotation marks by default", () => {
    render(<Testimonial quote="This changed how we communicate research." />);

    expect(
      screen.getByText('"This changed how we communicate research."')
    ).toBeInTheDocument();
  });

  it("strips existing quotation marks before re-wrapping the quote", () => {
    render(<Testimonial quote={'"Already quoted text"'} />);

    expect(screen.getByText('"Already quoted text"')).toBeInTheDocument();
  });

  it("omits quotation marks when showQuotationMarks is false", () => {
    render(<Testimonial quote="No marks here" showQuotationMarks={false} />);

    expect(screen.getByText("No marks here")).toBeInTheDocument();
    expect(screen.queryByText('"No marks here"')).not.toBeInTheDocument();
  });

  it("renders name, title, and institution only when provided", () => {
    render(
      <Testimonial
        quote="Great partnership"
        name="Dr. Amina Yusuf"
        title="Director of Research"
      />
    );

    expect(screen.getByText("Dr. Amina Yusuf")).toBeInTheDocument();
    expect(screen.getByText("Director of Research")).toBeInTheDocument();
  });

  it("shows the default brand text 'Magalela' unless overridden", () => {
    render(<Testimonial quote="Great partnership" />);

    expect(screen.getByText("Magalela")).toBeInTheDocument();
  });

  it("hides the brand line when showBrandLine is false", () => {
    render(<Testimonial quote="Great partnership" showBrandLine={false} />);

    expect(screen.queryByText("Magalela")).not.toBeInTheDocument();
  });
});
