"use client";

import { useState, useRef } from "react";
import Markdown from "react-markdown";
import { useI18n } from "@/lib/i18n";
import RegisterGate from "@/components/register-gate";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AskPage() {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const EXAMPLES =
    lang === "zh"
      ? [
          "哪些事故涉及行人？",
          "对比 Waymo 和 Apollo 的事故模式",
          "哪些场景需要 Layer 3 响应？",
          "最严重的事故有哪些？",
        ]
      : [
          "What incidents involved pedestrians?",
          "Compare Waymo vs Apollo incident patterns",
          "Which scenarios require Layer 3 response?",
          "What are the most severe incidents?",
        ];

  async function handleSubmit(question?: string) {
    const q = (question || input).trim();
    if (!q || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: q };
    // Build the history we'll send in one shot — React's setState is async,
    // so we can't rely on `messages` being updated when we call fetch below.
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setLoading(true);

    try {
      // Multi-turn: send the full conversation so Claude has context for
      // follow-ups. Server caps to last 20 messages.
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.error || data.answer,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    }
  }

  function handleClear() {
    setMessages([]);
    setInput("");
  }

  return (
    <RegisterGate>
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl mb-2">{t("ask.title")}</h1>
            <p className="text-[var(--muted)]">{t("ask.desc")}</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            >
              {t("ask.clear")}
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="py-12">
              <p className="text-center text-[var(--muted)] mb-6">
                {t("ask.try")}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleSubmit(ex)}
                    className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-sm text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--card-bg)] border border-[var(--border)] text-[var(--text)]"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Markdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li>{children}</li>,
                    }}
                  >
                    {msg.content}
                  </Markdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--muted)]">
                {t("ask.thinking")}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("ask.placeholder")}
            disabled={loading}
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-[var(--accent)] text-white px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
          >
            {t("ask.button")}
          </button>
        </form>
      </div>
    </RegisterGate>
  );
}
