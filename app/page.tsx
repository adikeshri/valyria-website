import { Star, Eye } from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";

const REPO = "https://github.com/adikeshri/valyria";
const APP_REPO = "https://github.com/adikeshri/valyria-app";

function GithubMark({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function Page() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-mark.png" alt="" aria-hidden />
          <span>Valyria</span>
        </a>
        <div className="spacer" />

        <a className="nav-link" href={REPO} target="_blank" rel="noreferrer">
          <GithubMark />
          <span className="hide-sm">GitHub</span>
        </a>

        <ThemeToggle />
      </header>

      <main>
        <section className="hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-dragon" src="/assets/logo-mark.png" alt="" aria-hidden />
          <div className="wrap">
            <span className="badge badge--accent">
              <span className="dot dot--warning dot--pulse" />
              Coming soon
            </span>

            <h1>
              The coding agent that <em>never</em> leaves your machine.
            </h1>

            <p className="lead">
              Valyria plans, edits, runs and verifies real work in your repository —
              on your own hardware, fully offline. No cloud. No telemetry. No leash.
            </p>

            <div className="hero-actions">
              <a className="btn btn--primary" href={REPO} target="_blank" rel="noreferrer">
                <Star size={16} aria-hidden />
                Star it on GitHub
              </a>
              <a className="btn" href={`${REPO}/subscription`} target="_blank" rel="noreferrer">
                <Eye size={16} aria-hidden />
                Watch for the drop
              </a>
            </div>

            <figure className="frame">
              <div className="frame-bar">
                <i />
                <i />
                <i />
                <span className="frame-title">Valyria — running locally</span>
              </div>
              <video
                className="frame-media"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/assets/hero-poster.jpg"
                aria-label="The Valyria desktop app: an agent working through a task across the Agent, Task, Diff, Tests and Terminal views."
              >
                <source src="/assets/hero.webm" type="video/webm" />
                <source src="/assets/hero.mp4" type="video/mp4" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/screenshot.png"
                  alt="The Valyria desktop app, mid-task: agent chat, the task plan, a code diff, test results and a terminal."
                />
              </video>
            </figure>
          </div>
        </section>

        <section className="claims">
          <div className="wrap">
            <p>
              Give it a task. It reads the code, makes the change, <em>runs your tests</em>,
              and fixes what it broke.
            </p>
            <p>
              Every step is journaled before it happens. Kill the process mid-run — it{" "}
              <em>picks up where it left off</em>.
            </p>
            <p>
              Nothing gets written, run, or installed <em>without your say-so</em>.
            </p>
          </div>
        </section>

        <section className="closer">
          <div className="wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="closer-mark" src="/assets/logo-mark.png" alt="" aria-hidden />
            <h2>Forged local. Sharpened offline.</h2>
            <p>The first release is close. Star the repo and you&apos;ll know the moment it lands.</p>
            <a className="btn btn--primary" href={REPO} target="_blank" rel="noreferrer">
              <Star size={16} aria-hidden />
              Star it on GitHub
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <span className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-mark.png" alt="" aria-hidden /> Valyria
          </span>
          <span className="footer-note">
            <a href={REPO} target="_blank" rel="noreferrer">
              runtime
            </a>{" "}
            ·{" "}
            <a href={APP_REPO} target="_blank" rel="noreferrer">
              desktop app
            </a>{" "}
            · Apache-2.0 · a local-first coding agent, written in Rust
          </span>
        </div>
      </footer>
    </>
  );
}
