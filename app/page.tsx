import Link from "next/link";

const GITHUB_REPO = "https://github.com/mayankgbh/gather-growth-engine";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight text-zinc-100">
            Outbound Growth Engine
          </span>
          <nav className="flex items-center gap-6">
            <a href="#how-it-works" className="hidden text-sm text-zinc-400 hover:text-zinc-200 sm:block">How it works</a>
            <a href="#features" className="hidden text-sm text-zinc-400 hover:text-zinc-200 sm:block">Features</a>
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-zinc-200">GitHub</a>
            <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-200">Log in</Link>
            <Link href="/signup" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">Get started free</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
          <p className="mb-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            Free &amp; open source &mdash; bring your own API keys
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl md:text-6xl">
            Your entire outbound pipeline.{" "}
            <span className="text-emerald-400">One engine.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Add your domain. We crawl your site, build an AI playbook, personalize
            a multi-step email sequence for every lead, verify and classify your
            list, send via Instantly, pull analytics, classify replies, and feed
            learnings back into the next batch. No SDR required.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-500">Get started free</Link>
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 font-medium text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-100">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              View on GitHub
            </a>
          </div>
        </section>

        {/* Numbers */}
        <section className="border-y border-zinc-800/80 bg-zinc-900/30">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px sm:grid-cols-4">
            {[
              { value: "5-step", label: "AI-written sequences" },
              { value: "10x", label: "Faster than manual SDR" },
              { value: "$0", label: "Platform cost" },
              { value: "1 click", label: "From leads to live campaign" },
            ].map((stat, i) => (
              <div key={i} className="px-6 py-8 text-center">
                <p className="text-2xl font-bold text-emerald-400 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <h2 className="text-center text-2xl font-semibold text-zinc-100 sm:text-3xl">From zero to sending in minutes</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-400">The full outbound loop, automated end-to-end.</p>
          <div className="mt-14 space-y-0">
            {[
              { step: "1", title: "Sign up and enter your domain", desc: "Create an account, add your site URL, and connect your Anthropic and Instantly API keys. Your keys stay encrypted and are only used for your account." },
              { step: "2", title: "We crawl your site and build your playbook", desc: "Our AI reads your homepage, infers what you sell, and generates a multi-step email sequence (subject lines, body copy, timing). You can edit every word, add proof points, and define your ICP before approving." },
              { step: "3", title: "Import leads, verify, and classify", desc: "Upload a CSV, paste a Google Sheets URL, or connect via API. We dedupe across batches, verify email deliverability (syntax + MX), and classify each lead by persona and vertical using AI so every email is tailored." },
              { step: "4", title: "AI writes a personalized sequence for every lead", desc: "Using your approved playbook, proof points, and each lead's profile (name, title, company, industry), Claude writes a unique multi-step sequence per lead. Preview all of them before sending." },
              { step: "5", title: "Send via Instantly with smart ramp", desc: "Choose your sending accounts (search by domain, select/deselect in bulk), name your campaign, and launch. We enforce safe sending limits (5/day cold, 30/day warm) and space steps 2\u20133 days apart." },
              { step: "6", title: "Track, learn, and optimize", desc: "We pull opens, clicks, and replies from Instantly automatically. Replies are classified by sentiment. Performance memory tracks what works by persona and vertical, and the strategy engine suggests concrete improvements for the next batch." },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 border-l border-zinc-800 py-6 pl-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/20 text-sm font-semibold text-emerald-400">{item.step}</div>
                <div>
                  <h3 className="font-medium text-zinc-100">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features grid */}
        <section id="features" className="border-y border-zinc-800/80 bg-zinc-900/50">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <h2 className="text-center text-2xl font-semibold text-zinc-100 sm:text-3xl">Everything you need for outbound</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-400">Every feature below is live and working today.</p>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: "\uD83C\uDF10", title: "Site crawl + product summary", desc: "We fetch your homepage and generate a product summary the AI uses to write relevant copy. Edit it anytime." },
                { icon: "\uD83D\uDCCB", title: "AI-generated playbook", desc: "Multi-step email sequence generated from your product, ICP, and proof points. Edit every step before approving." },
                { icon: "\uD83C\uDFAF", title: "Proof points", desc: "Add case studies, metrics, and testimonials. The AI weaves the most relevant one into each lead\u2019s sequence." },
                { icon: "\uD83E\uDDE0", title: "Persona + vertical classification", desc: "AI classifies each lead by role and industry so copy is tailored per segment." },
                { icon: "\u2709\uFE0F", title: "Hyper-personalized sequences", desc: "Every lead gets a unique multi-step sequence written by Claude using their name, title, company, and your playbook." },
                { icon: "\u2705", title: "Email verification", desc: "Syntax + MX record validation before you send. Protect your sender reputation by catching bad addresses early." },
                { icon: "\uD83D\uDCCA", title: "Performance memory", desc: "Tracks opens, clicks, and replies by persona and vertical. Shows what segments are working and where to double down." },
                { icon: "\uD83D\uDCA1", title: "Strategy suggestions", desc: "The engine analyzes your results and suggests changes: shorter subjects for low-open segments, different angles for quiet verticals." },
                { icon: "\uD83D\uDD01", title: "Reply classification", desc: "Replies are auto-classified as positive, objection, OOO, or not interested. Feeds directly into performance memory." },
                { icon: "\uD83D\uDCEC", title: "Instantly integration", desc: "Create campaigns, add leads, queue emails, and manage sending accounts from one dashboard. Pause campaigns with a click." },
                { icon: "\uD83C\uDFF7\uFE0F", title: "Domain & inbox management", desc: "List Instantly accounts, enable/disable warmup, and select senders by domain. Done-For-You domain ordering built in." },
                { icon: "\uD83D\uDCC8", title: "Campaign analytics", desc: "Sent, opens, clicks, replies, and reply sentiment for every campaign. Performance data syncs automatically." },
                { icon: "\uD83D\uDCD1", title: "Google Sheets import", desc: "Paste a Google Sheets URL to import leads directly. No more downloading and re-uploading CSVs." },
                { icon: "\uD83D\uDD00", title: "Dedupe across batches", desc: "Never email the same lead twice. Dedup runs per-workspace on every import." },
                { icon: "\u26A1", title: "10x faster generation", desc: "Parallel processing with Haiku model. Generate all sequences with one click and a progress bar." },
                { icon: "\uD83C\uDFA8", title: "Social proof & sender identity", desc: "Configure similar companies and referral phrases. Set your sender name so sign-offs are always correct." },
                { icon: "\uD83D\uDEE1\uFE0F", title: "Smart ramp & send limits", desc: "Cold inboxes: 5/day. Warm: 30/day. Minimum 1-day gap between first two steps. Protects deliverability by default." },
                { icon: "\uD83D\uDD14", title: "Feature requests & release notes", desc: "Submit ideas from inside the app. See every shipped improvement in the release notes section." },
              ].map((feat, i) => (
                <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5">
                  <div className="mb-2 text-lg">{feat.icon}</div>
                  <h3 className="font-medium text-zinc-200">{feat.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Free & open source */}
        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 sm:p-10">
            <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">Free now and forever</h2>
            <p className="mt-3 text-zinc-400">You bring your own Anthropic and Instantly API keys during onboarding. We never charge for the platform. No credit card, no trial, no usage fees.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { label: "AI", value: "Your Anthropic key" },
                { label: "Sending", value: "Your Instantly key" },
                { label: "Platform", value: "Free forever" },
              ].map((item, i) => (
                <div key={i} className="rounded-lg border border-zinc-700/50 bg-zinc-950/60 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-200">{item.value}</p>
                </div>
              ))}
            </div>
            <h2 className="mt-10 text-xl font-semibold text-zinc-100 sm:text-2xl">Open source</h2>
            <p className="mt-3 text-zinc-400">Fork it, self-host it, or contribute. Built with Next.js, Prisma, Tailwind, and the Anthropic API.</p>
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
              <span>View source on GitHub</span><span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-zinc-800/80 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">Stop doing outbound manually</h2>
            <p className="mt-4 text-zinc-400">Sign up, connect your site and keys, import your leads, and launch your first campaign today.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup" className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-500">Get started free</Link>
              <Link href="/login" className="rounded-lg border border-zinc-700 px-6 py-3 font-medium text-zinc-300 hover:border-zinc-600 hover:text-zinc-100">Log in</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm text-zinc-500">Outbound Growth Engine</span>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="https://gatherhq.com" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-zinc-400">Built by Gather</a>
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-zinc-400">GitHub</a>
            <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-400">Log in</Link>
            <Link href="/signup" className="text-sm text-zinc-500 hover:text-zinc-400">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
