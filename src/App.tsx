import { Github, Heart, ImagePlus, Sparkles } from 'lucide-react';

export function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-teal-700">OpenPhoto Studio</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal sm:text-5xl">
              Local-first photo editing for everyone.
            </h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Project links">
            <a className="btn-secondary" href={__REPOSITORY_URL__} rel="noreferrer" target="_blank">
              <Github aria-hidden="true" size={18} />
              Star on GitHub
            </a>
            <a className="btn-primary" href={__PAYPAL_URL__} rel="noreferrer" target="_blank">
              <Heart aria-hidden="true" size={18} />
              Support
            </a>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-6 py-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="space-y-5">
            <p className="max-w-xl text-lg leading-8 text-slate-700">
              A GitHub Pages app for import, adjust, mask, upscale, compare, and export workflows. Heavy
              imaging engines are lazy-loaded only when you ask for them.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="metric">
                <ImagePlus aria-hidden="true" />
                <span>Canvas editor</span>
              </div>
              <div className="metric">
                <Sparkles aria-hidden="true" />
                <span>AI-ready tools</span>
              </div>
              <div className="metric">
                <Github aria-hidden="true" />
                <span>Static Pages</span>
              </div>
            </div>
          </section>

          <section
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            aria-label="Editor preview"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-md bg-[linear-gradient(135deg,#111827,#0f766e_45%,#f97316)]">
              <div className="flex h-full items-end justify-between p-5 text-white">
                <div>
                  <p className="text-sm uppercase tracking-wide opacity-80">v{__APP_VERSION__}</p>
                  <p className="text-2xl font-semibold">Commit {__COMMIT_SHA__}</p>
                </div>
                <p className="rounded-md bg-white/15 px-3 py-2 text-sm backdrop-blur">
                  Editor loading scaffold
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
