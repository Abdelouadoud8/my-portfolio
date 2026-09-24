import React from "react";
import Image from "next/image";
import { Eye, Heart, MessageCircle, Play, Send } from "lucide-react";
import { FeaturedReel } from "@/data/types";
import { EVENTS, eventAttributes } from "@/lib/analytics";
import { formatCompact } from "@/lib/utils";

export default function ReelCard({
  id,
  title,
  description,
  imageUrl,
  href,
  tag,
  stats,
}: FeaturedReel) {
  const engagement = [
    { label: "likes", value: stats?.likes, Icon: Heart },
    { label: "comments", value: stats?.comments, Icon: MessageCircle },
    { label: "shares", value: stats?.shares, Icon: Send },
  ].filter((item) => item.value !== undefined);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2"
      {...eventAttributes(EVENTS.reelClick, { reel: id, location: "links" })}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-neutral-10">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 480px) 50vw, 220px"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {tag && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            {tag}
          </span>
        )}
        {stats?.views !== undefined && (
          <span
            className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-xs font-semibold text-white"
            title={`${stats.views.toLocaleString("en")} views`}
          >
            <Eye className="size-4" />
            {formatCompact(stats.views)}
          </span>
        )}
        <span className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full bg-primary text-white transition-transform duration-200 group-hover:scale-110">
          <Play className="size-3.5 fill-current" />
        </span>
      </div>
      <div className="min-w-0">
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
          <div className="mt-2 flex items-center gap-3 text-xs font-medium text-neutral-70">
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
