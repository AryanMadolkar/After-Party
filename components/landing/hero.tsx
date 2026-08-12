import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PhotoMosaic } from "@/components/landing/photo-mosaic";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <h1 className="font-serif text-[2.75rem] leading-[1.08] tracking-tight sm:text-6xl">
            Your camera roll has
            <br />
            300 photos.
            <br />
            <span className="italic text-muted-foreground">You only need 10.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            After Party uses AI to find the photos worth posting, build your carousel, write your
            caption, and finish the look.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Show when="signed-out">
              <Button asChild size="lg" className="group rounded-full px-6">
                <Link href="/sign-up">
                  Create a post
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </Show>
            <Show when="signed-in">
              <Button asChild size="lg" className="group rounded-full px-6">
                <Link href="/app/new">
                  Create a post
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </Show>
            <Button asChild variant="ghost" size="lg" className="rounded-full px-5">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
        </div>

        <PhotoMosaic count={9} className="w-full" />
      </div>
    </section>
  );
}
