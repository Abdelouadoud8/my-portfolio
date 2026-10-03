import React from "react";
import Image from "next/image";
import { Eye, Heart, MessageCircle, Play, Send } from "lucide-react";
import { FeaturedReel } from "@/data/types";
import { DYNAMIC_EVENTS, eventAttributes } from "@/lib/analytics";
import { formatCompact } from "@/lib/utils";

export default function ReelCard({
  id,
  title,
  description,
  imageUrl,
  href,
  tag,
  stats,
  location = "links",
  layout = "vertical",
  hideComments = false,
}: FeaturedReel & {
  location?: string;
  // "horizontal" = small thumbnail left, details right (blog sidebar)
  layout?: "vertical" | "horizontal";
  hideComments?: boolean;
}) {
  const isHorizontal = layout === "horizontal";
  const engagement = [
    // In the horizontal layout views join the other counts (the thumbnail is too small for an overlay)
    ...(isHorizontal
      ? [{ label: "views", value: stats?.views, Icon: Eye }]
      : []),
    { label: "likes", value: stats?.likes, Icon: Heart },
    {
      label: "comments",
      value: hideComments ? undefined : stats?.comments,
      Icon: MessageCircle,
    },
    { label: "shares", value: stats?.shares, Icon: Send },
  ].filter((item) => item.value !== undefined);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // Horizontal cards read right to left: cover on the right, Arabic text right-aligned beside it
      dir={isHorizontal ? "rtl" : undefined}
      className={`group flex gap-2 ${
        isHorizontal
          ? "flex-row items-stretch gap-3 rounded-lg border border-neutral-20 bg-white p-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_6px_20px_rgba(230,57,70,0.12)]"
          : "flex-col"
      }`}
      {...eventAttributes(DYNAMIC_EVENTS.reelClick(id), {
        reel: id,
        location,
      })}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-lg bg-neutral-10 ${
          // Horizontal: the cover takes the height of the text beside it (image cropped), not a 9:16 ratio
          isHorizontal ? "min-h-20 w-20 rounded-md" : "aspect-[9/16] w-full"
        }`}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes={isHorizontal ? "80px" : "(max-width: 480px) 50vw, 220px"}
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {tag && (
          <span
            className={`absolute rounded-full bg-white/90 font-bold uppercase tracking-wide text-primary ${
              isHorizontal
                ? "left-1 top-1 px-1.5 text-[8px]"
                : "left-2 top-2 px-2 py-0.5 text-[10px]"
            }`}
          >
            {tag}
          </span>
        )}
        {!isHorizontal && stats?.views !== undefined && (
          <span
            className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-xs font-semibold text-white"
            title={`${stats.views.toLocaleString("en")} views`}
          >
            <Eye className="size-4" />
            {formatCompact(stats.views)}
          </span>
        )}
        <span
          className={`absolute flex items-center justify-center rounded-full bg-primary text-white transition-transform duration-200 group-hover:scale-110 ${
            isHorizontal ? "bottom-1 right-1 size-5" : "bottom-2 right-2 size-8"
          }`}
        >
          <Play
            className={`fill-current ${isHorizontal ? "size-2.5" : "size-3.5"}`}
          />
        </span>
      </div>
      <div
        className={`min-w-0 ${isHorizontal ? "flex-1 py-0.5 text-right" : ""}`}
      >
        <h3
          dir="auto"
          className="line-clamp-2 text-sm font-semibold leading-5 text-neutral-100 group-hover:text-primary"
        >
          {title}
        </h3>
        <p
          dir="auto"
          className="mt-1 line-clamp-2 text-xs leading-4 text-neutral-60"
        >
          {description}
        </p>
        {engagement.length > 0 && (
          <div
            className={`mt-2 flex flex-wrap items-center text-xs font-medium text-neutral-70 ${
              isHorizontal ? "gap-x-2.5 gap-y-1" : "gap-3"
            }`}
          >
            {engagement.map(({ label, value, Icon }) => (
              <span
                key={label}
                className="flex items-center gap-1"
                title={`${value!.toLocaleString("en")} ${label}`}
              >
                <Icon className="size-3.5 text-primary" />
                {formatCompact(value!)}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
