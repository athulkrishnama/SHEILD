import React from "react";

/**
 * Snow Overlay Component
 * Creates elegant snow effect for hero sections
 * Based on reference Christmas designs
 */
export const SnowOverlay: React.FC = () => {
  return (
    <svg
      className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
      style={{ height: "60px" }}
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 30 Q50 10 100 30 T200 30 T300 30 T400 30 T500 30 T600 30 T700 30 T800 30 T900 30 T1000 30 T1100 30 T1200 30 L1200 60 L0 60 Z"
        fill="white"
        opacity="0.95"
      />
      <path
        d="M0 40 Q75 25 150 40 T300 40 T450 40 T600 40 T750 40 T900 40 T1050 40 T1200 40 L1200 60 L0 60 Z"
        fill="white"
        opacity="1"
      />
    </svg>
  );
};

/**
 * Corner Snowflake Decoration
 * Subtle decorative element
 */
export const SnowflakeDecor: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2V22M12 2L8 6M12 2L16 6M12 22L8 18M12 22L16 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.49 7.5L3.51 16.5M20.49 7.5L16.5 8.5M20.49 7.5L19.5 11.5M3.51 16.5L7.5 15.5M3.51 16.5L4.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.49 16.5L3.51 7.5M20.49 16.5L19.5 12.5M20.49 16.5L16.5 15.5M3.51 7.5L4.5 11.5M3.51 7.5L7.5 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * Ornament Divider
 * Decorative separator element
 */
export const OrnamentDivider: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 my-8">
      <div className="h-px bg-border-grey flex-1" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="6" fill="#D62828" opacity="0.2" />
        <circle cx="10" cy="10" r="4" fill="#D62828" />
        <circle cx="10" cy="8" r="1" fill="white" opacity="0.6" />
      </svg>
      <div className="h-px bg-border-grey flex-1" />
    </div>
  );
};

export default { SnowOverlay, SnowflakeDecor, OrnamentDivider };
