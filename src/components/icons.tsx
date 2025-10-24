import type { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="24" height="24" rx="6" className="fill-current text-sidebar-primary" />
    <path
      d="M9 15L12 12L15 15"
      stroke="hsl(var(--sidebar-primary-foreground))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12V18"
      stroke="hsl(var(--sidebar-primary-foreground))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 7H6"
      stroke="hsl(var(--sidebar-primary-foreground))"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
