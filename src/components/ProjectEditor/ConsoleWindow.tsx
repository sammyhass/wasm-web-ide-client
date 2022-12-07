import {
  ArrowDownIcon,
  ArrowUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import create from 'zustand';

type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

type ConsoleT = {
  handleMessage: (e: MessageEvent) => void;
  _messages: {
    type: 'console';
    level: LogLevel;
    createdAt: number;
    args: any[];
  }[];
  clear: () => void;
};

export const useEditorConsole = create<ConsoleT>((set, get) => ({
  _messages: [],
  clear: () => set({ _messages: [] }),
  handleMessage: (e: MessageEvent) => {
    if (e.data.type !== 'console') return;

    const [method, ...args] = e.data.data;

    if (typeof console[method as LogLevel] === 'function') {
      console[method as LogLevel](...args);
    } else {
      console.log(...e.data);
    }

    set(state => ({
      _messages: [
        ...state._messages,
        {
          type: 'console',
          level: method,
          args,
          createdAt: Date.now(),
        },
      ],
    }));
  },
}));

export default function ConsoleWindow() {
  const [show, setShow] = useState(true);
  const messages = useEditorConsole(state => state._messages);
  const handleMessage = useEditorConsole(state => state.handleMessage);
  const clear = useEditorConsole(state => state.clear);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (e.data.type === 'console') {
        handleMessage(e);
      }
    };

    window.addEventListener('message', listener);

    return () => {
      window.removeEventListener('message', listener);
    };
  }, [handleMessage]);

  return (
    <div className="flex flex-col gap-2 text-sm absolute bottom-0 w-full pl-2">
      {show ? (
        <div>
          <div className="flex gap-2 items-center">
            <b>
              Console <span className="text-xs">({messages.length})</span>
            </b>
            <div className="flex-1 flex gap-2">
              <button onClick={() => setShow(!show)} title="Hide Console">
                <ArrowDownIcon className="w-5 h-5" />
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
          <div className="h-28 max-h-32 min-h-12 overflow-y-auto py-2">
            {messages.map((m, i) => (
              <div
                key={`${m.createdAt}`}
                className={`font-mono ${consoleMessageClass(m.level)}`}
              >
                {format(m.createdAt, ' HH:mm:ss dd MMM')}{' '}
                {m.level.toUpperCase()}:{' '}
                {m.args.map((a, i) => (
                  <span key={i}>{a}</span>
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
