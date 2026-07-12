"use client";

import { useEffect, useRef, useState } from "react";

const PROMPT = "root@ashley-margetts:~#";

// The boot sequence. Commands type out char-by-char; output prints once the
// command finishes. `accent` colors the output line.
type Line = { cmd: string; out: React.ReactNode; accent?: string };

const LINES: Line[] = [
  {
    cmd: "cat me.txt",
    out: (
      <span className="text-[var(--tg-fg)]">
        Ashley Margetts : <span className="text-[var(--tg-amber)]">MIT</span>{" "}
        Robotics &amp; Mechanical Engineering.
      </span>
    ),
  },
  {
    cmd: "ls ~/interests",
    out: (
      <span className="text-[var(--tg-green)]">
        mechanical-design/{"  "}mechatronics/{"  "}robotic-systems/{"  "}
        <span className="text-[var(--tg-teal)]">making/</span>
      </span>
    ),
  },
  {
    cmd: "systemctl status open-to-work.service",
    out: (
      <span className="text-[var(--tg-fg)]">
        <span className="text-[var(--tg-green)]">●</span> active (running) — open
        to <span className="text-[var(--tg-amber)]">new full-time roles</span> ↗
      </span>
    ),
  },
  {
    cmd: "./featured --show",
    out: (
      <span className="text-[var(--tg-dim)]">
        planting {""}
        <span className="text-[var(--tg-green)]">featured work</span> below ↓
      </span>
    ),
  },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export default function TerminalHero() {
  // How many lines are fully revealed, and how far the current command is typed.
  const [doneLines, setDoneLines] = useState(0);
  const [typed, setTyped] = useState("");
  const finished = doneLines >= LINES.length;
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDoneLines(LINES.length);
      return;
    }

    let cancelled = false;
    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.current.push(id);
    };

    const typeLine = (index: number) => {
      if (index >= LINES.length) return;
      const cmd = LINES[index].cmd;
      let i = 0;
      const step = () => {
        if (cancelled) return;
        i += 1;
        setTyped(cmd.slice(0, i));
        if (i < cmd.length) {
          schedule(step, 42 + Math.random() * 40);
        } else {
          // command finished typing -> reveal its output, pause, next line
          schedule(() => {
            setDoneLines(index + 1);
            setTyped("");
            schedule(() => typeLine(index + 1), 520);
          }, 260);
        }
      };
      schedule(step, 240);
    };

    typeLine(0);
    return () => {
      cancelled = true;
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, []);

  const renderPromptLine = (cmd: string, cursor: boolean) => (
    <div className="flex flex-wrap items-start gap-x-2 leading-relaxed">
      <span className="text-[var(--tg-green)] shrink-0 select-none">{PROMPT}</span>
      <span className="text-[var(--tg-fg)] break-words">
        {cmd}
        {cursor && <span className="tg-cursor" aria-hidden="true" />}
      </span>
    </div>
  );

  const renderLineGroup = (line: Line, key: React.Key) => (
    <div key={key} className="space-y-1">
      {renderPromptLine(line.cmd, false)}
      <div className="pl-0 sm:pl-1 break-words">{line.out}</div>
    </div>
  );

  return (
    <div className="tg-window max-w-3xl">
      {/* window chrome */}
      <div className="tg-titlebar">
        <span className="tg-dot" style={{ background: "#cf6a34" }} />
        <span className="tg-dot" style={{ background: "#e2983f" }} />
        <span className="tg-dot" style={{ background: "#96b85f" }} />
        <span className="ml-2 text-xs sm:text-sm text-[var(--tg-dim)] tracking-wide">
          ashley-margetts — bash
        </span>
      </div>

      {/* terminal body */}
      <div className="p-5 sm:p-7 text-sm sm:text-base">
        <div className="relative">
          {/* Sizer: renders the finished state invisibly to reserve exactly the
              content's final height at the current width. Keeps the box from
              growing during the type-on animation, and — because it reflows with
              the content — keeps the space below the last line constant at every
              window width. */}
          <div aria-hidden="true" className="invisible space-y-3">
            {LINES.map((line, i) => renderLineGroup(line, i))}
            {renderPromptLine("", false)}
          </div>

          {/* Animated content, overlaid on the sizer. */}
          <div className="absolute inset-0 space-y-3">
            {LINES.slice(0, doneLines).map((line, i) => renderLineGroup(line, i))}

            {/* the line currently being typed */}
            {!finished && renderPromptLine(typed, true)}

            {/* resting prompt once the sequence completes */}
            {finished && renderPromptLine("", true)}
          </div>
        </div>
      </div>
    </div>
  );
}
