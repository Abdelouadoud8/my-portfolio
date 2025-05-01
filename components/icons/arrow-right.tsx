export type IconProps = {
  color?: string;
  width?: number;
  height?: number;
};

export const RightArrow = ({
  color = "#252525",
  width = 64,
  height = 24,
}: IconProps) => {
  return (
    <svg
      width={`${width}`}
      height={`${height}`}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 10.5C1.17157 10.5 0.5 11.1716 0.5 12C0.5 12.8284 1.17157 13.5 2 13.5V10.5ZM63.0607 13.0607C63.6464 12.4749 63.6464 11.5251 63.0607 10.9393L53.5147 1.3934C52.9289 0.807611 51.9792 0.807611 51.3934 1.3934C50.8076 1.97919 50.8076 2.92893 51.3934 3.51472L59.8787 12L51.3934 20.4853C50.8076 21.0711 50.8076 22.0208 51.3934 22.6066C51.9792 23.1924 52.9289 23.1924 53.5147 22.6066L63.0607 13.0607ZM2 13.5H62V10.5H2V13.5Z"
        fill={color}
      />
    </svg>
  );
};
