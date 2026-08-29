"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";

// Sign-ups are inserted straight into Supabase from the browser: an `anon` key
// (safe to ship — it's gated by a Row-Level-Security policy that only allows
// INSERT on this one table). Set both vars in `.env.local` and in the Vercel
// project. With them unset the form falls back to opening the mail client.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SUPABASE_TABLE = "beta_signups";
const SUPABASE_ON = SUPABASE_URL !== "" && SUPABASE_ANON_KEY !== "";

const BETA_EMAIL = "beta@valyria.dev";
const DONE_KEY = "valyria-beta-signed-up";

// Reject submissions that arrive faster than a human could plausibly fill four
// required fields — bots typically post within milliseconds of loading.
const MIN_FILL_MS = 3000;

type State = "idle" | "sending" | "done" | "error";

const OSES = ["macOS", "Linux", "Windows", "Other"] as const;

export default function BetaAccessForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  // Stamped at first render so the time-trap is armed from the very first moment
  // the form can be submitted — not only after effects have run.
  const mountedAt = useRef(Date.now());

  useEffect(() => {
    try {
      if (localStorage.getItem(DONE_KEY) === "1") setState("done");
    } catch {
      /* storage blocked — just show the form */
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real people leave it empty.
    if (data.get("_gotcha")) return;

    // Time-trap: too fast to be a person. Let them retry — by the time they
    // click again enough time has passed.
    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      setError("Take a moment to double-check your details, then submit again.");
      setState("error");
      return;
    }

    const values = {
      email: String(data.get("email") || "").trim(),
      name: String(data.get("name") || "").trim(),
      company: String(data.get("company") || "").trim(),
      designation: String(data.get("designation") || "").trim(),
      os: String(data.get("os") || ""),
      useCase: String(data.get("useCase") || "").trim(),
    };

    if (!values.email) {
      setError("An email address is required.");
      setState("error");
      return;
    }
    if (!values.name || !values.company || !values.designation) {
      setError("Name, company and designation are required.");
      setState("error");
      return;
    }

    setError("");
    setState("sending");

    try {
      if (SUPABASE_ON) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            email: values.email,
            name: values.name,
            company: values.company,
            designation: values.designation,
            os: values.os,
            use_case: values.useCase,
            source: "valyria.dev",
          }),
        });
        // 409 = this email is already in the table (unique constraint). That's
        // still "you're on the list", so treat it as success.
        if (!res.ok && res.status !== 409) {
          throw new Error(`Sign-up failed (${res.status})`);
        }
      } else {
        // Not configured — hand off to the visitor's mail client.
        const body = [
          `Email: ${values.email}`,
          `Name: ${values.name}`,
          `Designation: ${values.designation}`,
          `Company: ${values.company}`,
          `Primary OS: ${values.os || "—"}`,
          "",
          "What I'd use Valyria for:",
          values.useCase || "—",
        ].join("\n");
        const href = `mailto:${BETA_EMAIL}?subject=${encodeURIComponent(
          "Valyria — early access request",
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
      }

      try {
        localStorage.setItem(DONE_KEY, "1");
      } catch {
        /* ignore */
      }
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="beta-done" role="status">
        <span className="beta-done-mark">
          <Check size={18} aria-hidden />
        </span>
        <div>
          <strong>You&apos;re on the list.</strong>
          <p>
            {SUPABASE_ON
              ? "We'll email you when beta builds go out."
              : "Send the email your client just opened and we'll be in touch when beta builds go out."}
          </p>
        </div>
      </div>
    );
  }

  const sending = state === "sending";

  return (
    <form className="beta-form" onSubmit={onSubmit} noValidate>
      <p aria-hidden className="hp">
        <label>
          Leave this empty
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="field-row">
        <label className="field">
          <span>Email <b aria-hidden>*</b></span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            disabled={sending}
          />
        </label>

        <label className="field">
          <span>Name <b aria-hidden>*</b></span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="What should we call you?"
            disabled={sending}
          />
        </label>
      </div>

      <div className="field-row">
        <label className="field">
          <span>Company <b aria-hidden>*</b></span>
          <input
            type="text"
            name="company"
            required
            autoComplete="organization"
            placeholder="Where you work"
            disabled={sending}
          />
        </label>

        <label className="field">
          <span>Designation <b aria-hidden>*</b></span>
          <input
            type="text"
            name="designation"
            required
            autoComplete="organization-title"
            placeholder="Your role / title"
            disabled={sending}
          />
        </label>
      </div>

      <label className="field">
        <span>Primary OS</span>
        <select name="os" defaultValue="macOS" disabled={sending}>
          {OSES.map((os) => (
            <option key={os} value={os}>
              {os}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>
          What would you use Valyria for? <em className="field-opt">optional</em>
        </span>
        <textarea
          name="useCase"
          rows={3}
          placeholder="Languages, repo size, the kind of work you'd hand off…"
          disabled={sending}
        />
      </label>

      {state === "error" && (
        <p className="form-status form-status--err" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--primary" disabled={sending}>
        {sending ? (
          <>
            <Loader2 size={16} className="spin" aria-hidden />
            Sending…
          </>
        ) : (
          <>
            <Send size={16} aria-hidden />
            Request early access
          </>
        )}
      </button>

      <p className="form-note">
        No spam — one email when beta builds are ready. Unsubscribe any time.
      </p>
    </form>
  );
}
