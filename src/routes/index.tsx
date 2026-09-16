import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";

import advisorPortrait from "@/assets/advisor-portrait.jpg";
import {
  CasesMarquee,
  ProcessTimeline,
  SoundFamiliar,
  TestimonialsCarousel,
} from "@/components/interactive-sections";

import { site } from "@/lib/site-content";
import { sendContactMessage } from "@/lib/contact.functions";
import { EditProvider, Ed } from "@/lib/editable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Raymond James — Before We Meet" },
      {
        name: "description",
        content:
          "Meet your advisor before the first conversation: our process, services, client outcomes, and a link to book a time that suits you.",
      },
      { property: "og:title", content: "Raymond James — Before We Meet" },
      {
        property: "og:description",
        content:
          "Our process, services, client outcomes, and an easy way to book your introductory meeting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <EditProvider>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-mist via-[oklch(0.93_0.02_235)] to-[oklch(0.89_0.03_235)] font-sans text-ink">
        <div className="pointer-events-none absolute -top-32 -left-24 size-[520px] rounded-full bg-brand-light/25 blur-[120px]" />
        <div className="pointer-events-none absolute top-40 -right-28 size-[480px] rounded-full bg-accent-gold/25 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 size-[420px] rounded-full bg-brand/20 blur-[130px]" />

        <div className="relative mx-auto max-w-6xl px-6">
          <header className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-brand font-serif text-lg font-bold text-mist shadow-lg shadow-brand/30">
                <Ed id="firmShort">{site.firmShort}</Ed>
              </div>
              <div className="leading-tight">
                <p className="font-serif text-lg font-semibold text-brand">
                  <Ed id="firmName">{site.firmName}</Ed>
                </p>
                <p className="text-[11px] tracking-[0.22em] text-brand-light uppercase">
                  <Ed id="tagline">{site.tagline}</Ed>
                </p>
              </div>
            </div>
            <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
              <a href="#process" className="hover:text-brand">
                Our Process
              </a>
              <a href="#services" className="hover:text-brand">
                Client Services
              </a>
              <a href="#cases" className="hover:text-brand">
                Testimonials &amp; Case Studies
              </a>
            </nav>
            <a
              href="#book"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-mist shadow-lg shadow-brand/30 transition hover:bg-brand-light"
            >
              Book a Strategy Call
            </a>
          </header>

          <section className="grid items-center gap-10 py-6 md:grid-cols-[1.1fr_0.9fr] md:py-10">
            <div>
              <h1 className="font-serif text-5xl leading-[1.05] font-semibold text-brand md:text-6xl">
                <Ed id="hero.title">{site.hero.title}</Ed>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
                <Ed id="hero.body">{site.hero.body}</Ed>
              </p>
              <p className="mt-4 font-serif text-lg font-semibold text-brand">
                <Ed id="advisorName">{site.advisorName}</Ed>
                <span className="ml-2 font-sans text-xs tracking-[0.15em] text-ink/50 uppercase">
                  <Ed id="firmFull">{site.firmFull}</Ed>
                </span>
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#book"
                  className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-mist shadow-xl shadow-brand/30 transition hover:bg-brand-light"
                >
                  {"Apply To See If We're a Fit"}
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-8">
                {site.hero.stats.map((stat, i) => (
                  <div key={stat.label}>
                    <p className="font-serif text-3xl font-semibold text-brand">
                      <Ed id={`hero.stat.${i}.value`}>{stat.value}</Ed>
                    </p>
                    <p className="text-xs tracking-[0.15em] text-ink/50 uppercase">
                      <Ed id={`hero.stat.${i}.label`}>{stat.label}</Ed>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src={advisorPortrait}
                alt="Joshua Wilson, financial advisor with Raymond James"
                width={1024}
                height={1280}
                className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl shadow-brand/20"
              />
            </div>
          </section>

          <ProcessTimeline />

          <SoundFamiliar />

          <section id="services" className="py-8">
            <p className="text-xs font-semibold tracking-[0.22em] text-accent-gold uppercase">
              <Ed id="services.kicker">What we do</Ed>
            </p>
            <h2 className="mt-3 mb-10 font-serif text-4xl font-semibold text-brand">
              <Ed id="services.heading">Services</Ed>
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {site.services.map((service, i) => (
                <div
                  key={service.title}
                  className="glass rounded-2xl border border-white/60 p-7 shadow-sm"
                >
                  <h3 className="font-serif text-xl font-semibold text-brand">
                    <Ed id={`services.${i}.title`}>{service.title}</Ed>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
                    <Ed id={`services.${i}.body`}>{service.body}</Ed>
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <a
                href="#contact"
                className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-mist shadow-xl shadow-brand/30 transition hover:bg-brand-light"
              >
                {"Apply To See If We're a Fit"}
              </a>
            </div>
          </section>


          <CasesMarquee />

          <TestimonialsCarousel />

          <section id="book" className="mx-auto max-w-4xl py-8">
            <div className="glass-strong rounded-3xl border border-white/60 p-8 shadow-2xl shadow-brand/10 md:p-12">
              <ContactForm />
            </div>
          </section>


          <footer className="border-t border-white/50 py-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-brand font-serif font-bold text-mist">
                  <Ed id="footer.short">{site.firmShort}</Ed>
                </div>
                <p className="font-serif text-lg font-semibold text-brand">
                  <Ed id="footer.firmFull">{site.firmFull}</Ed>
                </p>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-ink/50">
                <Ed id="disclosure">{site.disclosure}</Ed>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </EditProvider>
  );
}

function ContactForm() {
  const send = useServerFn(sendContactMessage);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      await send({
        data: {
          name: String(formData.get("name") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          email: String(formData.get("email") ?? ""),
          qualification: String(formData.get("qualification") ?? ""),
          message: String(formData.get("message") ?? ""),
        },
      });
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-brand/10 bg-white/70 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-brand-light focus:outline-none";

  return (
    <div id="contact" className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold tracking-[0.22em] text-accent-gold uppercase">
        <Ed id="contact.kicker">Get started</Ed>
      </p>
      <h2 className="mt-3 font-serif text-4xl font-semibold text-brand">
        {"Apply to see if we're a fit"}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-ink/70">
        <Ed id="contact.body">
          Share a few details and we'll be in touch within one business day to see whether a
          conversation makes sense.
        </Ed>
      </p>
      <form className="mx-auto mt-8 grid max-w-2xl gap-4 text-left md:grid-cols-2" onSubmit={onSubmit}>
        <div>
          <label className="text-xs font-medium text-ink/60" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={120}
            placeholder="Jordan Avery"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink/60" htmlFor="phone">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            maxLength={40}
            placeholder="(555) 123-4567"
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-ink/60" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-ink/60" htmlFor="qualification">
            Which option describes you best:
          </label>
          <select id="qualification" name="qualification" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select one
            </option>
            {site.contactOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-ink/60" htmlFor="message">
            How can we help?
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            maxLength={4000}
            placeholder="Tell us a bit about your goals..."
            className={`${inputClass} resize-none`}
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-mist shadow-lg shadow-brand/30 transition hover:bg-brand-light disabled:opacity-60 md:col-span-2"
        >
          {status === "sending" ? "Sending…" : "Apply To See If We're a Fit"}
        </button>
        {status === "sent" && (
          <p className="text-sm font-medium text-brand md:col-span-2">
            Thank you — your message has been sent. We'll reply within one business day.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm font-medium text-destructive md:col-span-2">{error}</p>
        )}
      </form>
    </div>
  );
}

