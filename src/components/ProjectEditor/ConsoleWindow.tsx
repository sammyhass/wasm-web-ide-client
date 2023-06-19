import { useEditorSettings } from "@/hooks/useEditorSettings";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Ansi from "ansi-to-react";
import { useCallback, useEffect, useRef, useState } from "react";
import create from "zustand";

type LogLevel = "log" | "error" | "warn" | "info" | "debug";

type ConsoleT = {
  handleMessage: (e: MessageEvent) => void;
  _messages: {
    type: "console";
    level: LogLevel;
    createdAt: number;
    args: unknown[];
  }[];
  clear: () => void;
  push: (logLevel: LogLevel, message: string) => void;

  mustScroll: boolean;
  _setMustScroll: (mustScroll: boolean) => void;
};

function joinRecursive(arr: unknown[]): string {
  return arr
    .map((arg) => {
      if (Array.isArray(arg)) {
        return joinRecursive(arg);
      }

      return arg;
    })
    .join(" ");
}

export const useEditorConsole = create<ConsoleT>((set, get) => ({
  _messages: [],
  mustScroll: true,
  _setMustScroll: (mustScroll: boolean) => set({ mustScroll }),
  push: (logLevel: LogLevel, message: string) => {
    set((state) => ({
      _messages: [
        ...state._messages,
        {
          type: "console",
          level: logLevel,
          args: [message],
          createdAt: Date.now(),
        },
      ],
    }));

    get()._setMustScroll(true);
  },
  clear: () => set({ _messages: [] }),
  handleMessage: (e: MessageEvent) => {
    if (e.data.type !== "console") return;

    const [method, ...args] = e.data.data;

    if (typeof console[method as LogLevel] === "function") {
      console[method as LogLevel](...args);
    } else {
      console.log(...e.data);
    }

    get().push(method as LogLevel, joinRecursive(args));
  },
}));

export default function ConsoleWindow() {
  const [show, setShow] = useState(true);
  const theme = useEditorSettings((s) => s.theme);
  const messages = useEditorConsole((state) => state._messages);
  const handleMessage = useEditorConsole((state) => state.handleMessage);
  const clear = useEditorConsole((state) => state.clear);
  const mustScroll = useEditorConsole((state) => state.mustScroll);
  const setMustScroll = useEditorConsole((state) => state._setMustScroll);
  const messagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    setMustScroll(false);
  }, [setMustScroll]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.data.type === "console") {
        console.log(e.data);
        handleMessage(e);
      }
    };

    if (mustScroll) {
      scrollToBottom();
    }

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [handleMessage, mustScroll, scrollToBottom]);

  const isDark = theme.includes("dark");

  return (
    <div
      className={`absolute bottom-0 flex w-full flex-col gap-2 pb-2 text-sm  ${
        isDark
          ? "bg-base-200 bg-opacity-60 backdrop-blur-md"
          : "border-t border-base-300 bg-white text-black shadow-inner"
      }`}
    >
      {show ? (
        <div>
          <div className="my-2 flex items-center gap-2 px-2">
            <b>Console ({messages.length})</b>
            <div className="flex flex-1">
              <button
                onClick={() => setShow(!show)}
                title="Hide Console"
                className="btn btn-ghost btn-xs flex gap-2"
              >
                <ArrowDownIcon className="h-5 w-5" /> Hide
              </button>
              <button
                onClick={() => clear()}
                title="Clear Console"
                className="btn btn-ghost btn-xs flex gap-2"
              >
                <XMarkIcon className="h-5 w-5" /> Clear
              </button>
            </div>
          </div>
          <div
            className="min-h-12 h-48 max-h-52 overflow-y-auto py-2 px-2 pb-6"
            ref={messagesRef}
            data-testid="console-messages"
          >
            {messages.map((m, i) => (
              <div
                key={`${m.createdAt}-${i}-${m.level}`}
                data-testid="console-message"
                className={`font-mono ${consoleMessageClass(
                  m.level,
                  isDark ? "dark" : "light"
                )} max-w-full break-all py-1 ${
                  isDark ? "hover:bg-base-200" : "hover:bg-slate-100"
                }`}
              >
                {m.args.map((a, i) => (
                  <span key={i} className="break-normal">
                    <Ansi>{new Object(a).toString()}</Ansi>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          className=" flex w-full items-center gap-2 p-2 text-sm"
          onClick={() => {
            setShow(true);
            scrollToBottom();
          }}
          title="Show Console"
        >
          <ArrowUpIcon className="h-5 w-5" />
          <b>Show Console ({messages.length})</b>
        </button>
      )}
    </div>
  );
}

const consoleMessageClass = (level: LogLevel, theme: "dark" | "light") => {
  switch (level) {
    case "log":
      return theme === "dark" ? "text-neutral-content" : "text-black";
    case "error":
      return "text-error";
    case "warn":
      return "text-warning";
    case "info":
      return "text-accent";
    case "debug":
      return "text-neutral-content";
  }
};
