import type { SVGProps } from "react";

export function BsnConnectLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4h7v7H4z" fill="hsl(var(--accent))" stroke="none"/>
      <path d="M13 13h7v7h-7z" fill="hsl(var(--primary))" stroke="none" />
      <path d="M4 13h7v7H4z" />
      <path d="M13 4h7v7h-7z" />
    </svg>
  );
}
