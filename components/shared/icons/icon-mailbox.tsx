import { IconProps } from "@/components/shared/icons/icon-arrow-right";

// Phosphor "mailbox"
export const IconMailbox = ({
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
          d="M232,116v60a8,8,0,0,1-8,8H128V116A52,52,0,0,0,76,64H180A52,52,0,0,1,232,116Z"
          fill="currentColor"
        />
        <path
          d="M104,152a8,8,0,0,1-8,8H56a8,8,0,0,1,0-16H96A8,8,0,0,1,104,152Zm136-36v60a16,16,0,0,1-16,16H136v32a8,8,0,0,1-16,0V192H32a16,16,0,0,1-16-16V116A60.07,60.07,0,0,1,76,56h76V24a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H168V56h12A60.07,60.07,0,0,1,240,116ZM120,176V116a44,44,0,0,0-88,0v60Zm104-60a44.05,44.05,0,0,0-44-44H168v72a8,8,0,0,1-16,0V72H116.75A59.86,59.86,0,0,1,136,116v60h88Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};
