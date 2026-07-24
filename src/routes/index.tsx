import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { submitLeadFn } from "../server";
import { leadSchema, type LeadFormData } from "../lib/schemas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeadDesk Mini — Modern lead capture for B2B teams" },
      {
        name: "description",
        content:
          "Capture, qualify, and route every lead from one clean dashboard built for modern B2B teams.",
      },
      { property: "og:title", content: "LeadDesk Mini — Modern lead capture" },
      {
        property: "og:description",
        content: "Capture, qualify, and route every lead in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const submitLead = useServerFn(submitLeadFn);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    mode: "onBlur",
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onSubmit = async (data: LeadFormData) => {
    try {
      await submitLead({ data });
      toast.success("Thanks! We'll be in touch within 24 hours.");
      reset();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit lead. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-primary">
      <Toaster />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="tracking-tight">LeadDesk Mini</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              Admin login
            </Link>
            <Button size="sm" onClick={scrollToForm} className="gap-1.5">
              Request a demo
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Split hero */}
      <section className="relative overflow-hidden">
        {/* ambient background wash */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-accent/60 blur-3xl" />
          <div className="absolute top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
            {/* Copy */}
            <div className="lg:col-span-7 space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-primary">
                  New — smart lead routing
                </span>
              </div>

              <h1
                className="text-5xl font-bold leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                LeadDesk <span className="text-primary">Mini</span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
                The lightweight sales engine for growing teams. Capture leads,
                qualify them automatically, and route every conversation to the
                right rep — in one clean dashboard.
              </p>

              {/* Benefits */}
              <ul className="grid gap-3 sm:grid-cols-2 max-w-lg">
                {[
                  "Instant setup, no engineering",
                  "Smart auto-routing",
                  "Enterprise-grade privacy",
                  "Works with your CRM",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-primary">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-foreground/85">{t}</span>
                  </li>
                ))}
              </ul>

              {/* Social proof */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  <div className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/70 to-primary" />
                  <div className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-accent to-primary/60" />
                  <div className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-foreground to-ink-2" />
                  <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold text-muted-foreground">
                    +9k
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    Trusted by 10,000+ teams
                  </span>
                  <span className="text-xs text-muted-foreground">
                    From early-stage startups to Fortune 500 sales orgs.
                  </span>
                </div>
              </div>
            </div>

            {/* Lead capture card */}
            <div
              ref={formRef}
              className="lg:col-span-5 relative animate-fade-in"
            >
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-primary/25 via-accent/60 to-transparent blur-3xl opacity-70"
              />
              <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-7 shadow-[0_32px_64px_-16px_rgba(11,18,32,0.15)] lg:p-9">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/60 blur-2xl" aria-hidden />

                <div className="mb-7 relative">
                  <h2
                    className="text-2xl font-semibold tracking-tight text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Tell us about your project
                  </h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    We'll reach out within 24 hours. No credit card required.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative" noValidate>
                  <FieldWrap
                    label="Full name"
                    htmlFor="name"
                    error={errors.name?.message}
                  >
                    <Input
                      id="name"
                      {...register("name")}
                      aria-invalid={!!errors.name}
                      placeholder="Jane Cooper"
                      className="h-12 rounded-xl bg-muted/60 px-4 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                    />
                  </FieldWrap>

                  <FieldWrap
                    label="Work email"
                    htmlFor="email"
                    error={errors.email?.message}
                  >
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      aria-invalid={!!errors.email}
                      placeholder="jane@company.com"
                      className="h-12 rounded-xl bg-muted/60 px-4 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                    />
                  </FieldWrap>

                  <FieldWrap label="Budget range" htmlFor="budget" error={errors.budget?.message}>
                    <BudgetSelect watch={watch} setValue={setValue} />
                  </FieldWrap>

                  <FieldWrap label="What are you building?" htmlFor="message" error={errors.message?.message}>
                    <Textarea
                      id="message"
                      {...register("message")}
                      rows={3}
                      aria-invalid={!!errors.message}
                      placeholder="Tell us a bit about your team and goals..."
                      className="rounded-xl bg-muted/60 px-4 py-3 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary resize-none"
                    />
                  </FieldWrap>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="group mt-2 h-12 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Get started
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>

                  <p className="pt-1 text-center text-[11px] text-muted-foreground">
                    By submitting, you agree to our Terms and Privacy Policy.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-t border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: Zap, title: "Fast capture", desc: "Beautiful forms in minutes." },
              { icon: ShieldCheck, title: "Secure by default", desc: "Enterprise-grade privacy." },
              { icon: Sparkles, title: "Smart triage", desc: "Auto-tag and route leads." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <div
                    className="font-semibold text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {f.title}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Built for Digital Heroes Training Task
        </a>
      </footer>
    </div>
  );
}

function BudgetSelect({
  watch,
  setValue,
}: {
  watch: any;
  setValue: any;
}) {
  const budgetValue = watch("budget");

  return (
    <Select value={budgetValue} onValueChange={(v) => setValue("budget", v, { shouldValidate: true })}>
      <SelectTrigger
        id="budget"
        className="h-12 rounded-xl bg-muted/60 px-4 focus:ring-2 focus:ring-primary/30 focus:border-primary data-[placeholder]:text-muted-foreground"
      >
        <SelectValue placeholder="Select budget" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="< $1,000">&lt; $1,000</SelectItem>
        <SelectItem value="$1k - $5k">$1k – $5k</SelectItem>
        <SelectItem value="$5k - $10k">$5k – $10k</SelectItem>
        <SelectItem value="$10k+">$10k+</SelectItem>
      </SelectContent>
    </Select>
  );
}

function FieldWrap({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80"
      >
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
