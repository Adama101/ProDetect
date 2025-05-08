import type { SVGProps } from 'react';

export function ProDetectLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ProDetect Logo"
      {...props}
    >
      <path d="M50 5 L10 27.5 L10 72.5 L50 95 L90 72.5 L90 27.5 L50 5 Z M50 15 L80 32.5 L80 67.5 L50 85 L20 67.5 L20 32.5 L50 15 Z M45 35 L45 65 L30 57.5 L30 42.5 L45 35 Z M70 35 L70 65 L55 72.5 L55 27.5 L70 35 Z" />
    </svg>
  );
}