import {
  CheckIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useRef } from 'react';
import create from 'zustand';
import shallow from 'zustand/shallow';

export type AlertIdentifier =
  | 'compile-error'
  | 'compile-success'
  | 'run-error'
  | 'run-success';

type Alert = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

type ShowAlertInput = Pick<Alert, 'message' | 'type'> & {
  id: AlertIdentifier;
};

const generateAlertId = (ident: AlertIdentifier) =>
  `alert-${ident}-${Math.random().toString(36).substr(2, 9)}`;

type AlertStore = {
  alerts: Alert[];
  show: (alert: ShowAlertInput) => void;
  hide: (id: AlertIdentifier | string) => void;
  pop: () => void;
  clearAlerts: () => void;
};

export const useToast = create<AlertStore>(set => ({
  alerts: [],
  show: (alert: ShowAlertInput) => {
    const id = generateAlertId(alert.id);
    set(state => ({
      alerts: [...state.alerts, { ...alert, id }],
    }));
    return id;
  },
  hide: (id: string) => {
    set(state => ({
      alerts: state.alerts.filter(alert => alert.id !== id),
    }));
  },
  pop: () => {
    set(state => ({
      alerts: state.alerts.slice(1),
    }));
  },
  clearAlerts: () => set({ alerts: [] }),
}));

export const AlertIcon = ({ type }: { type: Alert['type'] }) => {
  switch (type) {
    case 'success':
      return <CheckIcon className="w-5 h-5" />;
    case 'error':
      return <ExclamationCircleIcon className="w-5 h-5 text-error" />;
    case 'info':
      return <InformationCircleIcon className="w-5 h-5 text-info" />;
  }
};

export const Alert = ({
  onHide,
  onClick,
  ...alert
}: Alert & {
  onHide?: AlertStore['hide'];
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={() => onClick && onClick()}
      className={`alert relative min-w-[300px] max-w-xl font-medium
      ${
        alert.type === 'success'
          ? 'alert-success'
          : alert.type === 'error'
          ? 'alert-danger'
          : alert.type === 'info'
          ? 'alert-info'
          : ''
      }
    `}
    >
      <div className="flex-1 flex mr-6">
        <AlertIcon type={alert.type} />
        <p>{alert.message}</p>
      </div>

      <button
        className="absolute top-1 right-1 btn btn-square btn-ghost btn-sm"
        onClick={() => onHide?.(alert.id)}
      >
        <XCircleIcon />
      </button>
    </div>
  );
};

export const ToastProvider = () => {
  const { alerts, hide, pop } = useToast(
    s => ({ alerts: s.alerts, hide: s.hide, pop: s.pop }),
    shallow
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (alerts.length > 0) {
      intervalRef.current = setInterval(() => {
        pop();
      }, 10000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [alerts.length, pop]);

  return (
    <div className="toast toast-bottom toast-end">
      {alerts.map(alert => (
        <Alert key={alert.id} {...alert} onHide={hide} />
      ))}
    </div>
  );
};
