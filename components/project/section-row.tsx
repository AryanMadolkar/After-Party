import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function SectionRow({
  title,
  href,
  thumbnails,
  emptyLabel,
}: {
  title: string;
  href: string;
  thumbnails: string[];
  emptyLabel: string;
}) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl tracking-tight">{title}</h2>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {thumbnails.length > 0 ? "View" : "Create"}
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {thumbnails.length > 0 ? (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {thumbnails.map((url, i) => (
            <div
              key={i}
              className="relative aspect-[4/5] w-32 shrink-0 overflow-hidden rounded-md bg-muted sm:w-40"
            >
              <Image src={url} alt="" fill sizes="160px" className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <Link
          href={href}
          className="mt-4 flex h-24 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          {emptyLabel}
        </Link>
      )}
    </section>
  );
}
