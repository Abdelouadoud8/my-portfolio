import { IconProps } from "./icon-arrow-right";

export const IconLeftArrow = ({
  width = 64,
  height = 24,
  className,
}: IconProps) => {
  return (
    <div className={className}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M62 10.5C62.8284 10.5 63.5 11.1716 63.5 12C63.5 12.8284 62.8284 13.5 62 13.5V10.5ZM0.93934 13.0607C0.353553 12.4749 0.353553 11.5251 0.93934 10.9393L10.4853 1.3934C11.0711 0.807612 12.0208 0.807612 12.6066 1.3934C13.1924 1.97918 13.1924 2.92893 12.6066 3.51472L4.12132 12L12.6066 20.4853C13.1924 21.0711 13.1924 22.0208 12.6066 22.6066C12.0208 23.1924 11.0711 23.1924 10.4853 22.6066L0.93934 13.0607ZM62 12V13.5H2V12V10.5H62V12Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
