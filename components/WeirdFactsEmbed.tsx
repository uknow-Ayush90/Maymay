"use client";

import { useState, useCallback } from "react";
import { RefreshCw, Trophy, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Difficulty = "easy" | "medium" | "hard";

interface Fact {
  statement: string;
  options: string[];
  answer: string;
  explanation: string;
  emoji: string;
  category: string;
  difficulty: Difficulty;
  reveal?: { label: string; value: string };
}

const FACTS: Fact[] = [
  // Python
  {
    statement: "Python was named after Monty Python, not the snake.",
    options: ["True", "False"],
    answer: "True",
    explanation: "_____ was reading Monty Python's Flying Circus scripts while creating the language. The snake logo came later!",
    reveal: { label: "Who created Python?", value: "Guido van Rossum" },
    emoji: "🐍",
    category: "Python",
    difficulty: "easy",
  },
  {
    statement: "In Python, `0.1 + 0.2 == 0.3` returns...",
    options: ["True", "False", "TypeError", "None"],
    answer: "False",
    explanation: "Due to floating point precision, `0.1 + 0.2` is actually `_____`. Use `math.isclose()` instead!",
    reveal: { label: "Actual value?", value: "0.30000000000000004" },
    emoji: "🤯",
    category: "Python",
    difficulty: "hard",
  },
  {
    statement: "Python's `is` operator checks value equality, just like `==`.",
    options: ["True", "False"],
    answer: "False",
    explanation: "`is` checks identity (same object in memory), `==` checks value equality. `a = [1]; b = [1]; a == b` is True but `_____` is False.",
    reveal: { label: "Identity check?", value: "a is b" },
    emoji: "🔍",
    category: "Python",
    difficulty: "medium",
  },
  {
    statement: "How many keywords does Python 3 have?",
    options: ["18", "35", "52", "12"],
    answer: "35",
    explanation: "Python 3 has exactly _____ reserved keywords like `if`, `else`, `lambda`, `yield`, `async`, `await` etc. Quite few for a full language!",
    reveal: { label: "Exact count?", value: "35 keywords" },
    emoji: "📚",
    category: "Python",
    difficulty: "hard",
  },
  {
    statement: "In Python, an empty list `[]` is falsy.",
    options: ["True", "False"],
    answer: "True",
    explanation: "Empty sequences (list, tuple, string, dict, set) are all falsy in Python. `_____` returns `False`. This is very useful for condition checks!",
    reveal: { label: "What returns False?", value: "bool([])" },
    emoji: "📋",
    category: "Python",
    difficulty: "easy",
  },
  {
    statement: "Python's GIL (Global Interpreter Lock) allows true multi-threaded CPU parallelism.",
    options: ["True", "False"],
    answer: "False",
    explanation: "The GIL prevents multiple threads from executing Python bytecode simultaneously. For CPU-bound tasks, use _____ instead of `threading`!",
    reveal: { label: "What to use instead?", value: "multiprocessing" },
    emoji: "🔒",
    category: "Python",
    difficulty: "medium",
  },
  {
    statement: "Which Python version finally removed the GIL (experimentally)?",
    options: ["Python 3.9", "Python 3.12", "Python 3.13", "Python 4.0"],
    answer: "Python 3.13",
    explanation: "Python 3.13 introduced an experimental '_____' mode allowing true multi-core parallelism!",
    reveal: { label: "The flag name?", value: "free-threaded / --disable-gil" },
    emoji: "🚀",
    category: "Python",
    difficulty: "hard",
  },

  // Architecture
  {
    statement: "REST stands for Representational State Transfer.",
    options: ["True", "False"],
    answer: "True",
    explanation: "_____ coined REST in his 2000 PhD dissertation. Most people use REST APIs daily without knowing what the acronym means!",
    reveal: { label: "Who coined REST?", value: "Roy Fielding" },
    emoji: "🌐",
    category: "Architecture",
    difficulty: "easy",
  },
  {
    statement: "A monolith is always a bad architecture choice.",
    options: ["True", "False"],
    answer: "False",
    explanation: "Monoliths are great for small teams and early-stage products. Even _____ run on monoliths at massive scale. 'It depends' is the real answer!",
    reveal: { label: "Famous monolith examples?", value: "Shopify & Stack Overflow" },
    emoji: "🏛️",
    category: "Architecture",
    difficulty: "easy",
  },
  {
    statement: "How many fallacies of distributed computing are there?",
    options: ["4", "6", "8", "12"],
    answer: "8",
    explanation: "_____ listed 8 fallacies: network is reliable, latency is zero, bandwidth is infinite, network is secure, topology doesn't change, there's one admin, transport cost is zero, network is homogeneous.",
    reveal: { label: "Who listed them?", value: "Peter Deutsch" },
    emoji: "☁️",
    category: "Architecture",
    difficulty: "hard",
  },
  {
    statement: "CQRS stands for Command Query Responsibility Segregation.",
    options: ["True", "False"],
    answer: "True",
    explanation: "CQRS separates read (_____) and write (_____) operations. It's overkill for most apps but architects love mentioning it in diagrams!",
    reveal: { label: "Full form?", value: "Query = Read, Command = Write" },
    emoji: "📐",
    category: "Architecture",
    difficulty: "medium",
  },
  {
    statement: "CAP Theorem says a distributed system can guarantee all three: Consistency, Availability, Partition tolerance.",
    options: ["True", "False"],
    answer: "False",
    explanation: "_____ says you can only pick 2 of 3. In practice, partition tolerance is mandatory, so the real choice is CP vs AP!",
    reveal: { label: "Who proposed it?", value: "Eric Brewer (Brewer's Theorem)" },
    emoji: "📊",
    category: "Architecture",
    difficulty: "medium",
  },
  {
    statement: "What does 'idempotent' mean in APIs?",
    options: [
      "Calling it once or many times has same result",
      "It returns the same response format always",
      "It never throws errors",
      "It uses HTTP GET method",
    ],
    answer: "Calling it once or many times has same result",
    explanation: "An idempotent operation produces the same result whether you call it once or 100 times. _____ and _____ are idempotent, POST is not!",
    reveal: { label: "Idempotent HTTP methods?", value: "DELETE and PUT" },
    emoji: "🔄",
    category: "Architecture",
    difficulty: "medium",
  },
  {
    statement: "Event sourcing stores the current state of entities directly in the database.",
    options: ["True", "False"],
    answer: "False",
    explanation: "Event sourcing stores a log of all events that led to the current state. Think of it like a _____ vs account balance!",
    reveal: { label: "Real-world analogy?", value: "Bank statement (transaction log)" },
    emoji: "📜",
    category: "Architecture",
    difficulty: "hard",
  },

  // Scrum / Agile
  {
    statement: "In Scrum, the Product Owner can change sprint goals mid-sprint.",
    options: ["True", "False"],
    answer: "False",
    explanation: "The Sprint Goal is fixed once the Sprint starts. Only the _____ can add/remove work — and only with Scrum Master facilitation!",
    reveal: { label: "Who owns sprint scope?", value: "Development Team" },
    emoji: "🎯",
    category: "Scrum",
    difficulty: "medium",
  },
  {
    statement: "The Scrum Guide recommends Daily Scrum should be exactly 15 minutes.",
    options: ["True", "False"],
    answer: "True",
    explanation: "The _____ Scrum Guide explicitly says Daily Scrum is a 15-minute event. The 3 questions format was removed in this update!",
    reveal: { label: "Which edition?", value: "2020 Scrum Guide" },
    emoji: "⏱️",
    category: "Scrum",
    difficulty: "easy",
  },
  {
    statement: "A Sprint Retrospective is mandatory in Scrum.",
    options: ["True", "False"],
    answer: "True",
    explanation: "Retro is one of _____ Scrum events (Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective). Skipping it is not Scrum!",
    reveal: { label: "How many Scrum events total?", value: "5 events" },
    emoji: "🔁",
    category: "Scrum",
    difficulty: "easy",
  },
  {
    statement: "Story points measure how many hours a task will take.",
    options: ["True", "False"],
    answer: "False",
    explanation: "Story points measure relative _____, NOT time. A 2-point story for a senior dev might take 1 hour; for a junior, 1 day. That's the point!",
    reveal: { label: "What do points measure?", value: "Complexity / Effort" },
    emoji: "🃏",
    category: "Scrum",
    difficulty: "medium",
  },
  {
    statement: "In Scrum, who is responsible for removing impediments?",
    options: ["Product Owner", "Scrum Master", "Development Team", "Stakeholders"],
    answer: "Scrum Master",
    explanation: "The _____ is the 'servant leader' responsible for removing impediments and protecting the team from external distractions.",
    reveal: { label: "Their Scrum role title?", value: "Scrum Master = Servant Leader" },
    emoji: "🛡️",
    category: "Scrum",
    difficulty: "easy",
  },
  {
    statement: "Velocity is a planning tool in Scrum used to predict future sprint capacity.",
    options: ["True", "False"],
    answer: "True",
    explanation: "Velocity (avg story points per sprint) helps forecast sprint capacity. But using it as a _____ or comparing teams is an anti-pattern!",
    reveal: { label: "Common misuse?", value: "KPI / performance metric" },
    emoji: "📈",
    category: "Scrum",
    difficulty: "medium",
  },

  // General Tech / Weird
  {
    statement: "The first computer bug was an actual bug (insect).",
    options: ["True", "False"],
    answer: "True",
    explanation: "In 1947, _____'s team found an actual moth stuck in a relay of the Harvard Mark II computer. They taped it in the logbook!",
    reveal: { label: "Who found the bug?", value: "Grace Hopper" },
    emoji: "🦗",
    category: "Tech Trivia",
    difficulty: "easy",
  },
  {
    statement: "Git was created by Linus Torvalds in just 10 days.",
    options: ["True", "False"],
    answer: "True",
    explanation: "After a fallout with _____ in 2005, Linus Torvalds wrote the first version of Git in about 10 days.",
    reveal: { label: "Previous VCS they used?", value: "BitKeeper" },
    emoji: "🐧",
    category: "Tech Trivia",
    difficulty: "medium",
  },
  {
    statement: "The average developer Googles 'how to center a div' how many times per year?",
    options: ["~50 times", "~100 times", "~200 times", "Only once, they memorized it"],
    answer: "~100 times",
    explanation: "'_____' is consistently one of the most searched CSS queries globally, year after year. You're not alone!",
    reveal: { label: "The eternal question?", value: "how to center a div" },
    emoji: "🎨",
    category: "Tech Trivia",
    difficulty: "easy",
  },
  {
    statement: "SOLID stands for 5 object-oriented design principles. What does the 'L' stand for?",
    options: ["Loose coupling", "Liskov Substitution", "Lazy loading", "Linear dependency"],
    answer: "Liskov Substitution",
    explanation: "SOLID = Single responsibility, Open/closed, _____ substitution, Interface segregation, Dependency inversion.",
    reveal: { label: "Who is Liskov?", value: "Barbara Liskov — MIT computer scientist" },
    emoji: "🏗️",
    category: "Tech Trivia",
    difficulty: "medium",
  },
  {
    statement: "SQL stands for Structured Query Language.",
    options: ["True", "False"],
    answer: "True",
    explanation: "SQL was originally called _____ but was shortened due to a trademark dispute. IBM invented it in the 1970s!",
    reveal: { label: "Original full name?", value: "SEQUEL — Structured English Query Language" },
    emoji: "🗄️",
    category: "Tech Trivia",
    difficulty: "easy",
  },
];

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; border: string; text: string }> = {
  easy: { label: "Easy", color: "bg-green-700", border: "border-green-600", text: "text-green-400" },
  medium: { label: "Medium", color: "bg-yellow-700", border: "border-yellow-600", text: "text-yellow-400" },
  hard: { label: "Hard", color: "bg-red-700", border: "border-red-600", text: "text-red-400" },
};

type FilterMode = "all" | "Python" | "Architecture" | "Scrum" | "Tech Trivia";

const FILTERS: FilterMode[] = ["all", "Python", "Architecture", "Scrum", "Tech Trivia"];
const FILTER_EMOJIS: Record<FilterMode, string> = {
  all: "🌀",
  Python: "🐍",
  Architecture: "🏗️",
  Scrum: "📋",
  "Tech Trivia": "🧠",
};

export default function WeirdFactsEmbed() {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const filtered = FACTS.filter((f) => filter === "all" || f.category === filter);
  const current = filtered[currentIndex];
  const hasAnswered = answered.has(currentIndex);
  const isCorrect = selected === current?.answer;
  const isLast = currentIndex === filtered.length - 1;
  const isRevealed = revealed.has(currentIndex);

  const toggleReveal = useCallback(() => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) next.delete(currentIndex);
      else next.add(currentIndex);
      return next;
    });
  }, [currentIndex]);

  const handleGuess = useCallback(
    (option: string) => {
      if (hasAnswered) return;
      setSelected(option);
      setAnswered((prev) => new Set(prev).add(currentIndex));
      setTotal((t) => t + 1);
      if (option === current?.answer) setScore((s) => s + 1);
    },
    [hasAnswered, currentIndex, current]
  );

  const next = useCallback(() => {
    setSelected(null);
    setCurrentIndex((i) => Math.min(i + 1, filtered.length - 1));
  }, [filtered.length]);

  const prev = useCallback(() => {
    setSelected(answered.has(currentIndex - 1) ? filtered[currentIndex - 1]?.answer ?? null : null);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, [currentIndex, answered, filtered]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setTotal(0);
    setAnswered(new Set());
    setRevealed(new Set());
  }, []);

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Top bar */}
      <div className="flex-shrink-0 px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-b border-[#111111]">
        <div>
          <h2 className="text-base font-bold text-white">🧠 Weird Tech Facts — Can You Guess?</h2>
          <p className="text-xs text-[#6b7280]">Python • Architecture • Scrum • Tech Trivia</p>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#222]">
              <Trophy size={14} className={accuracy >= 70 ? "text-yellow-400" : "text-[#6b7280]"} />
              <span className="text-sm font-bold text-white">{score}/{total}</span>
              <span className="text-xs text-[#6b7280]">({accuracy}%)</span>
            </div>
          )}
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#111111] text-[#9ca3af] hover:text-white hover:bg-[#222222] transition-all"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex-shrink-0 flex gap-2 px-4 py-3 border-b border-[#111111] overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setCurrentIndex(0); setSelected(null); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
              filter === f
                ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                : "bg-[#111111] border-[#222222] text-[#9ca3af] hover:text-white"
            )}
          >
            {FILTER_EMOJIS[f]} {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {/* Meta row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#6b7280]">{currentIndex + 1} / {filtered.length}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#111111] border border-[#222] text-[#9ca3af]">
                {FILTER_EMOJIS[current?.category as FilterMode] ?? "❓"} {current?.category}
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full border font-semibold",
                DIFFICULTY_CONFIG[current?.difficulty]?.border,
                DIFFICULTY_CONFIG[current?.difficulty]?.text,
                "bg-[#0a0a0a]"
              )}>
                {DIFFICULTY_CONFIG[current?.difficulty]?.label}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-[#111111] rounded-full mb-6">
            <div
              className="h-1 bg-[#7c3aed] rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filtered.length) * 100}%` }}
            />
          </div>

          {/* Statement card */}
          <div className={cn(
            "rounded-2xl border p-6 mb-4 transition-all duration-200",
            hasAnswered
              ? isCorrect
                ? "bg-[#0a1a0a] border-green-600 shadow-[0_0_20px_rgba(22,163,74,0.15)]"
                : "bg-[#1a0a0a] border-red-700 shadow-[0_0_20px_rgba(220,38,38,0.15)]"
              : "bg-[#0a0a0a] border-[#1a1a1a]"
          )}>
            <div className="text-4xl mb-4 text-center">{current?.emoji}</div>
            <p className="text-lg font-semibold text-white text-center leading-relaxed">
              {current?.statement}
            </p>
          </div>

          {/* Options */}
          <div className={cn(
            "grid gap-2 mb-4",
            current?.options.length === 2 ? "grid-cols-2" : "grid-cols-1"
          )}>
            {current?.options.map((option) => {
              const isSelected = selected === option;
              const isAnswer = option === current.answer;
              let btnStyle = "bg-[#111111] border-[#222222] text-[#d1d5db] hover:border-[#7c3aed] hover:text-white";

              if (hasAnswered) {
                if (isAnswer) btnStyle = "bg-[#052e16] border-green-600 text-green-300 font-bold";
                else if (isSelected && !isAnswer) btnStyle = "bg-[#1c0a0a] border-red-600 text-red-300";
                else btnStyle = "bg-[#0a0a0a] border-[#1a1a1a] text-[#4b5563]";
              }

              return (
                <button
                  key={option}
                  onClick={() => handleGuess(option)}
                  disabled={hasAnswered}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left",
                    btnStyle,
                    !hasAnswered && "active:scale-[0.98] cursor-pointer",
                    hasAnswered && "cursor-default"
                  )}
                >
                  {hasAnswered && isAnswer && <span className="mr-2">✅</span>}
                  {hasAnswered && isSelected && !isAnswer && <span className="mr-2">❌</span>}
                  {option}
                </button>
              );
            })}
          </div>

          {/* Explanation (revealed after guess) */}
          {hasAnswered && (
            <div className={cn(
              "rounded-xl border px-4 py-3 mb-4 text-sm leading-relaxed",
              isCorrect
                ? "bg-[#052e16] border-green-700 text-green-200"
                : "bg-[#1c0a0a] border-red-800 text-red-200"
            )}>
              <span className="font-bold mr-1">{isCorrect ? "🎉 Correct!" : "💡 The answer is:"}</span>
              {!isCorrect && <span className="font-semibold text-green-300">{current.answer}. </span>}
              {current.explanation.split("_____").map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>
                    {part}
                    <span className="inline-flex items-center mx-0.5 align-middle">
                      <span className="text-xs text-[#9ca3af] mr-1">{current.reveal?.label}</span>
                      <button
                        onClick={toggleReveal}
                        className={cn(
                          "inline-block px-2 py-0.5 rounded text-xs font-bold transition-all border",
                          isRevealed
                            ? "bg-[#7c3aed]/20 border-[#7c3aed] text-[#c4b5fd]"
                            : "bg-[#222] border-[#444] text-transparent select-none blur-[3px] hover:blur-[2px]"
                        )}
                        title={isRevealed ? "Click to hide" : "Click to reveal"}
                      >
                        {current.reveal?.value ?? "???"}
                      </button>
                    </span>
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between">
            <button onClick={prev} disabled={currentIndex === 0} className="px-4 py-2 text-sm text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              ← Prev
            </button>
            {isLast && hasAnswered ? (
              <div className="text-center text-sm text-[#a78bfa] font-semibold animate-pulse">
                🏆 Done! Score: {score}/{total} ({accuracy}%)
              </div>
            ) : hasAnswered ? (
              <button
                onClick={next}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#7c3aed] hover:bg-[#8b5cf6] text-white text-sm font-bold transition-all active:scale-95"
              >
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <span className="text-xs text-[#4b5563]">Pick an answer to continue</span>
            )}
            <button onClick={next} disabled={isLast || !hasAnswered} className="px-4 py-2 text-sm text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
