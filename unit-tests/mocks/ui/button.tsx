import * as React from "react";
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: string; size?: string }>(
  ({ asChild, variant, size, ...p }, ref) => <button ref={ref} {...p} />
);
Button.displayName = "Button";
export default Button;
