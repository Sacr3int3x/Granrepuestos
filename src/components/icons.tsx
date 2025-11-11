import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Auto Parts Hub Logo</title>
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 8a4 4 0 1 0 4 4" />
      <path d="M12 4v4" />
      <path d="M12 16v4" />
      <path d="M4 12h4" />
      <path d="M16 12h4" />
      <path d="m15.5 15.5 2.5 2.5" />
      <path d="m6 6 2.5 2.5" />
      <path d="m6 18-2.5 2.5" />
      <path d="m18 6-2.5 2.5" />
    </svg>
  ),
};
