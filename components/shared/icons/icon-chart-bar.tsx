import { IconProps } from "@/components/shared/icons/icon-arrow-right";

// Phosphor "chart-bar"
export const IconChartBar = ({
  height = 24,
  width = 24,
  className,
}: IconProps) => {
  return (
    <div className={className}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.2"
          d="M208,40V208H152V40Z"
          fill="currentColor"
        />
        <path
          d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
