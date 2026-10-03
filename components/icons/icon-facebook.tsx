import { IconProps } from "./icon-arrow-right";

// Phosphor "facebook-logo" duotone icon, same style as the other social icons
export const IconFacebook = ({
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
          d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
          fill="currentColor"
        />
        <path
          d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
