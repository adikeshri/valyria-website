"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Mode = "light" | "dark" | "system";
const KEY = "valyria-theme";

const OPTIONS: { mode: Mode; label: string; Icon: typeof Sun }[] = [
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "dark", label: "Dark", Icon: Moon },
  { mode: "system", label: "Match system", Icon: Monitor },
];

function apply(mode: Mode) {
  const root = document.documentElement;
  if (mode === "light" || mode === "dark") root.setAttribute("data-theme", mode);
  else root.removeAttribute("data-theme");
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY) as Mode | null;
      if (stored === "light" || stored === "dark") setMode(stored);
    } catch {
      /* private mode / storage blocked — stay on system */
    }
  }, []);

  function choose(next: Mode) {
    setMode(next);
    apply(next);
    try {
      if (next === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Colour theme">
      {OPTIONS.map(({ mode: m, label, Icon }) => (
        <button
          key={m}
          type="button"
          title={label}
          aria-pressed={mode === m}
          onClick={() => choose(m)}
        >
          <Icon size={14} aria-hidden />
        </button>
      ))}
    </div>
  );
}
