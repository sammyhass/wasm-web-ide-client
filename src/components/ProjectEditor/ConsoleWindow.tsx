import {
  ArrowDownIcon,
  ArrowUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { useCallback, useEffect, useRef, useState } from 'react';
import create from 'zustand';

type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

type ConsoleT = {
  handleMessage: (e: MessageEvent) => void;
  _messages: {
    type: 'console';
    level: LogLevel;
    createdAt: number;
    args: unknown[];
  }[];
  clear: () => void;
  push: (logLevel: LogLevel, message: string) => void;

  mustScroll: boolean;
  _setMustScroll: (mustScroll: boolean) => void;
};

export const useEditorConsole = create<ConsoleT>((set, get) => ({
  _messages: [],
  mustScroll: true,
  _setMustScroll: (mustScroll: boolean) => set({ mustScroll }),
  push: (logLevel: LogLevel, message: string) => {
    set(state => ({
      _messages: [
        ...state._messages,
        {
          type: 'console',
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
    if (e.data.type !== 'console') return;

    const [method, ...args] = e.data.data;

    if (typeof console[method as LogLevel] === 'function') {
      console[method as LogLevel](...args);
    } else {
      console.log(...e.data);
    }

    get().push(method as LogLevel, args.join(' '));
  },
}));

export default function ConsoleWindow() {
  const [show, setShow] = useState(true);
  const messages = useEditorConsole(state => state._messages);
  const handleMessage = useEditorConsole(state => state.handleMessage);
  const clear = useEditorConsole(state => state.clear);
  const mustScroll = useEditorConsole(state => state.mustScroll);
  const setMustScroll = useEditorConsole(state => state._setMustScroll);
  const messagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      // smooth scroll to bottom
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }

    setMustScroll(false);
  }, [setMustScroll]);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.data.type === 'console') {
        handleMessage(e);
      }
    };

    if (mustScroll) {
      scrollToBottom();
    }

    window.addEventListener('message', listener);

    return () => {
      window.removeEventListener('message', listener);
    };
  }, [handleMessage, mustScroll, scrollToBottom]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  return (
    <div className="flex flex-col gap-2 text-sm absolute bottom-0 pb-2 w-full bg-opacity-60 bg-base-300 backdrop-blur-md">
      {show ? (
        <div>
          <div className="flex gap-2 items-center my-2 px-2">
            <b>Console ({messages.length})</b>
            <div className="flex-1 flex">
              <button
                onClick={() => setShow(!show)}
                title="Hide Console"
                className="btn btn-xs btn-ghost flex gap-2"
              >
                <ArrowDownIcon className="w-5 h-5" /> Hide
              </button>
              <button
                onClick={() => clear()}
                title="Clear Console"
                className="flex gap-2 btn btn-xs btn-ghost"
              >
                <XMarkIcon className="w-5 h-5" /> Clear
              </button>
            </div>
          </div>
          <div
            className="h-28 max-h-44 min-h-12 overflow-y-auto py-2 px-2 pb-6"
            ref={messagesRef}
            data-testid="console-messages"
          >
            {messages.map((m, i) => (
              <div
                key={`${m.createdAt}-${i}-${m.level}`}
                data-testid="console-message"
                className={`font-mono ${consoleMessageClass(
                  m.level
                )} break-normal hover:bg-base-200 py-1 max-w-full`}
              >
                {m.args.map((a, i) => (
                  <span key={i} className="break-normal">
                    {new Object(a).toString()}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          className=" p-2 flex items-center gap-2 text-sm w-full"
          onClick={() => setShow(true)}
          title="Show Console"
        >
          <ArrowUpIcon className="w-5 h-5" />
          <b>Show Console ({messages.length})</b>
        </button>
      )}
    </div>
  );
}

const consoleMessageClass = (level: LogLevel) => {
  switch (level) {
    case 'log':
      return 'text-neutral-content';
    case 'error':
      return 'text-error';
    case 'warn':
      return 'text-warning';
    case 'info':
      return 'text-accent';
    case 'debug':
      return 'text-neutral-content';
  }
};
