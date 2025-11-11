import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 128"
      fill="currentColor"
    >
      <title>GranRepuestos Logo</title>
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <path
        d="M101.4,48.6c-4.9-1.9-9.9-2.9-15-2.9c-11.8,0-22.7,4.8-30.6,12.8L40,42.7C31.5,30.3,17.9,22.8,2.7,22.8c-2.3,0-4.5,0.2-6.7,0.5l-2.6,0.3L-6,119.5l2.6,0.3c2.3,0.3,4.6,0.5,7,0.5c17.5,0,32.3-10,39.4-24.8l10,15.7c8.5,13.4,22.8,22,38.8,22c15.2,0,29-7.5,37.2-19.3l-5.6-8.8c-6.1,8.8-16,14.8-27,14.8c-12,0-22.8-6.4-28.8-16.3l-9.9-15.5c-0.3-0.5-0.6-1-0.9-1.4l41.2-61.9L101.4,48.6z M38.1,96.3c-4.8,7.5-12.7,12.3-21.5,12.3c-1.7,0-3.4-0.2-5-0.5l14-69.8c2.2,2.6,4.1,5.5,5.7,8.6L38.1,96.3z"
        transform="translate(15, -10)"
      />
      <path
        d="M249.7,20.4l-23.2,8.8c-2.3,0.9-3.8,3-3.8,5.4v12.2l-47.5-13.6L128,118.4h37.4l19.6-35.3h33.8v-9.4h-33.8l8.3-15h40.4v-9.4h-40.4l8.3-15h44.2v-9.4h-48.1L249.7,20.4z"
        transform="translate(15, -10)"
      />
    </svg>
  ),
};
