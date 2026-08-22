"use client";

import { UserRound } from "lucide-react";
import type { EditorDTO } from "@/lib/types";

type EditorSelectorProps = {
  editors: EditorDTO[];
  selectedEditorId: string;
  onSelect: (editorId: string) => void;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function EditorSelector({ editors, selectedEditorId, onSelect }: EditorSelectorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {editors.map((editor) => {
        const active = editor.id === selectedEditorId;

        return (
          <button
            type="button"
            key={editor.id}
            onClick={() => onSelect(editor.id)}
            className={`premium-card pixel-border liquid-glass group min-h-32 rounded-3xl border p-5 text-left ${
              active
                ? "border-blue-500/70 bg-blue-500/[0.12] shadow-blue"
                : "border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-500/25 bg-blue-500/10 font-days text-lg text-blue-600 dark:text-blue-300">
                {editor.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editor.avatar} alt={editor.name} className="h-full w-full object-cover" />
                ) : (
                  initials(editor.name) || <UserRound className="h-6 w-6" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-days text-xl tracking-normal">{editor.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/60 dark:text-white/60">
                  {editor.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
