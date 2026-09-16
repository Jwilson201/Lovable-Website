import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Ed } from "@/lib/editable";
import { site } from "@/lib/site-content";

export function ProcessTimeline() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const track = trackRef.current;
      if (!track) return;
      const bounds = track.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      const next = Math.min(1, Math.max(0, (anchor - bounds.top) / Math.max(bounds.height, 1)));
      setProgress(next);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const steps = site.process.steps;

  return (
    <section id="process" className="py-10 md:py-14">
      <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div className="md:sticky md:top-24 md:self-start">
          <p className="text-xs font-semibold tracking-[0.22em] text-accent-gold uppercase">
            <Ed id="process.kicker">Our process</Ed>
          </p>
          <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight font-semibold text-brand md:text-5xl">
            <Ed id="process.heading">A clear path from first call to financial clarity.</Ed>
          </h2>
          <div className="mt-6 max-w-md">
            <p className="text-base leading-7 text-ink/65">
              <Ed id="process.description">
                A real financial plan is never just about investments. We start every plan with the
                end goal in mind, then move to optimization, protection, and ultimately financial
                freedom.
              </Ed>
            </p>
          </div>
          <p className="mt-6 max-w-md text-base leading-7 text-ink/65">
            <Ed id="process.note">{site.process.note}</Ed>
          </p>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-mist shadow-lg shadow-brand/20 transition hover:bg-brand-light"
          >
            Apply To See If We're a Fit <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <div ref={trackRef} className="relative pl-10 md:pl-14">
          <div className="absolute top-2 bottom-2 left-[14px] w-1 -translate-x-1/2 rounded-full bg-brand/15 md:left-[20px]" />
          <div
            data-testid="process-progress"
            className="absolute top-2 left-[14px] w-1 -translate-x-1/2 rounded-full bg-brand md:left-[20px]"
            style={{ height: `calc((100% - 1rem) * ${progress})` }}
          />
          <div className="space-y-16 md:space-y-20">
            {steps.map((step, index) => {
              const active = progress >= index / Math.max(steps.length, 1);
              return (
                <article
                  key={step.n}
                  data-active={active}
                  className={`relative transition-opacity duration-500 ${
                    active ? "opacity-100" : "opacity-45"
                  }`}
                >
                  <span
                    className={`absolute top-1.5 -left-[34px] size-4 rounded-full border-2 transition-colors duration-500 md:-left-[46px] md:size-5 ${
                      active ? "border-brand bg-brand" : "border-brand/25 bg-mist"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-semibold text-brand-light/70">
                      <Ed id={`process.${index}.n`}>{step.n}</Ed>
                    </span>
                    <h3 className="font-serif text-2xl font-semibold text-brand">
                      <Ed id={`process.${index}.title`}>{step.title}</Ed>
                    </h3>
                  </div>
                  <p className="mt-3 max-w-lg text-base leading-7 text-ink/60">
                    <Ed id={`process.${index}.body`}>{step.body}</Ed>
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FamiliarCard({ index }: { index: number }) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const item = site.commonQuestions[index];

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  if (!item) return null;

  return (
    <article
      ref={cardRef}
      className={`glass rounded-2xl border border-white/60 p-7 shadow-sm transition-[opacity,transform,box-shadow] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: visible ? `${(index % 3) * 100}ms` : "0ms" }}
    >
      <h3 className="font-serif text-xl leading-snug font-semibold text-brand">
        <Ed id={`commonQuestions.${index}.title`}>{item.title}</Ed>
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">
        <Ed id={`commonQuestions.${index}.body`}>{item.body}</Ed>
      </p>
    </article>
  );
}

export function SoundFamiliar() {
  return (
    <section id="sound-familiar" className="py-8 md:py-10">
      <p className="text-xs font-semibold tracking-[0.22em] text-accent-gold uppercase">
        <Ed id="commonQuestions.kicker">Common concerns</Ed>
      </p>
      <h2 className="mt-3 mb-10 font-serif text-4xl font-semibold text-brand md:text-5xl">
        <Ed id="commonQuestions.heading">Sound Familiar?</Ed>
      </h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {site.commonQuestions.map((item, index) => (
          <FamiliarCard key={item.title} index={index} />
        ))}
      </div>
    </section>
  );
}

const CASE_HOVER = [
  "hover:-translate-x-2 hover:-translate-y-2",
  "hover:translate-x-2 hover:-translate-y-2",
  "hover:-translate-x-2 hover:translate-y-2",
  "hover:translate-x-2 hover:translate-y-2",
];

export function CasesMarquee() {
  return (
    <section id="cases" className="py-8">
      <p className="text-xs font-semibold tracking-[0.22em] text-accent-gold uppercase">
        <Ed id="cases.kicker">Real results</Ed>
      </p>
      <h2 className="mt-3 mb-10 font-serif text-4xl font-semibold text-brand">
        <Ed id="cases.heading">Case studies</Ed>
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {site.cases.map((item, index) => (
          <article
            key={item.label}
            className={`glass rounded-2xl border border-white/60 p-7 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.03] hover:shadow-xl ${
              CASE_HOVER[index % 4]
            }`}
          >
            <p className="font-serif text-3xl font-semibold text-brand">
              <Ed id={`cases.${index}.metric`}>{item.metric}</Ed>
            </p>
            <p className="mt-1 text-xs tracking-[0.15em] text-accent-gold uppercase">
              <Ed id={`cases.${index}.label`}>{item.label}</Ed>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              <Ed id={`cases.${index}.body`}>{item.body}</Ed>
            </p>
            <p className="mt-4 text-xs font-medium text-ink/40">
              <Ed id={`cases.${index}.profile`}>{item.profile}</Ed>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsCarousel() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [position, setPosition] = useState(1);
  const [animate, setAnimate] = useState(true);
  const movingRef = useRef(false);
  const total = site.testimonials.length;

  useLayoutEffect(() => {
    const measure = () => setWidth(viewportRef.current?.clientWidth ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const gap = 20;
  const slide = width > 0 ? width * (width < 640 ? 0.72 : 0.42) : 0;
  const peek = width * 0.06;
  const offset = peek - position * (slide + gap);
  const slides = [
    site.testimonials[total - 1],
    ...site.testimonials,
    site.testimonials[0],
    site.testimonials[1],
  ];

  const showPrevious = () => {
    if (movingRef.current) return;
    movingRef.current = true;
    setAnimate(true);
    setPosition((current) => current - 1);
  };
  const showNext = () => {
    if (movingRef.current) return;
    movingRef.current = true;
    setAnimate(true);
    setPosition((current) => current + 1);
  };

  const finishTransition = () => {
    if (position === 0) {
      setAnimate(false);
      setPosition(total);
    } else if (position === total + 1) {
      setAnimate(false);
      setPosition(1);
    }
    movingRef.current = false;
  };

  return (
    <section id="testimonials" className="py-8">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-accent-gold uppercase">
            <Ed id="testimonials.kicker">Client voices</Ed>
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-brand">
            <Ed id="testimonials.heading">Testimonials</Ed>
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 rounded-full border-brand/20 bg-mist/70 text-brand shadow-sm"
            onClick={showPrevious}
            aria-label="Previous testimonial"
          >
            <ArrowLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-11 rounded-full border-brand/20 bg-mist/70 text-brand shadow-sm"
            onClick={showNext}
            aria-label="Next testimonial"
          >
            <ArrowRight />
          </Button>
        </div>
      </div>

      <div ref={viewportRef} className="overflow-hidden">
        <div
          className={`flex ${animate ? "transition-transform duration-500 ease-out" : ""}`}
          style={{ gap, transform: `translateX(${offset}px)` }}
          onTransitionEnd={finishTransition}
        >
          {slides.map((testimonial, renderIndex) => {
            if (!testimonial) return null;
            const sourceIndex = (renderIndex - 1 + total) % total;
            return (
            <article
              key={`${testimonial.name}-${renderIndex}`}
              className="glass shrink-0 rounded-2xl border border-white/60 p-7 shadow-sm md:p-9"
              style={{ width: slide || "42%" }}
            >
              <div className="text-base tracking-widest text-accent-gold">★★★★★</div>
              <p className="mt-4 font-serif text-xl leading-relaxed text-ink/80 italic md:text-2xl">
                <Ed id={`testimonials.${sourceIndex}.quote`}>{`“${testimonial.quote}”`}</Ed>
              </p>
              <div className="mt-6 border-t border-brand/10 pt-4">
                <p className="text-sm font-semibold text-brand">
                  <Ed id={`testimonials.${sourceIndex}.name`}>{testimonial.name}</Ed>
                </p>
                <p className="text-xs text-ink/50">
                  <Ed id={`testimonials.${sourceIndex}.role`}>{testimonial.role}</Ed>
                </p>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
