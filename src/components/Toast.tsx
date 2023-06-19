import {
  CheckIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef } from "react";
import create from "zustand";
import shallow from "zustand/shallow";

const AlertTypes = [
  "compile-error",
  "compile-success",
  "run-error",
  "run-success",
  "project-save-success",
  "project-save-error",
] as const;

type AlertIdentifier = typeof AlertTypes[number] | string;

type Alert = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

type ShowAlertInput = Pick<Alert, "message" | "type"> & {
  id: AlertIdentifier;
};

const generateAlertId = (ident: AlertIdentifier) =>
  `alert-${ident}-${Math.random().toString(36).slice(0, 12)}`;

type AlertStore = {
  alerts: Alert[];
  show: (alert: ShowAlertInput) => void;
  hide: (id: AlertIdentifier | string) => void;
  pop: () => void;
  clearAlerts: () => void;
};

export const useToast = create<AlertStore>((set) => ({
  alerts: [],
  show: (alert: ShowAlertInput) => {
    const id = generateAlertId(alert.id);
    set((state) => ({
      alerts: [...state.alerts, { ...alert, id }],
    }));
    return id;
  },
  hide: (id: string) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    }));
  },
  pop: () => {
    set((state) => ({
      alerts: state.alerts.slice(1),
    }));
  },
  clearAlerts: () => set({ alerts: [] }),
}));

export const AlertIcon = ({ type }: { type: Alert["type"] }) => {
  switch (type) {
    case "success":
      return <CheckIcon className="h-5 w-5" />;
    case "error":
      return <ExclamationCircleIcon className="h-5 w-5 text-error" />;
    case "info":
      return <InformationCircleIcon className="h-5 w-5 text-info" />;
  }
};

export const Alert = ({
  onHide,
  onClick,
  ...alert
}: Alert & {
  onHide?: AlertStore["hide"];
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <div
      onClick={() => onClick && onClick()}
      className={`alert relative min-w-[300px] max-w-xl font-medium
      ${
        alert.type === "success"
          ? "alert-success"
          : alert.type === "error"
          ? "alert-danger"
          : alert.type === "info"
          ? "alert-info"
          : ""
      } ${alert.className || ""}`}
    >
      <div className="mr-6 flex flex-1">
        <AlertIcon type={alert.type} />
        <p>{alert.message}</p>
      </div>
      {onHide && (
        <button
          className="btn btn-ghost btn-square btn-sm absolute top-1 right-1"
          onClick={() => onHide?.(alert.id)}
        >
          <XCircleIcon />
        </button>
      )}
    </div>
  );
};

export const ToastProvider = () => {
  const { alerts, hide, pop } = useToast(
    (s) => ({ alerts: s.alerts, hide: s.hide, pop: s.pop }),
    shallow
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (alerts.length > 0) {
      intervalRef.current = setInterval(() => {
        pop();
      }, 2500);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [alerts.length, pop]);

  return (
    <div className="toast toast-end toast-bottom" data-testid="toast">
      {alerts.map((alert) => (
        <Alert key={alert.id} {...alert} onHide={hide} />
      ))}
    </div>
  );
};
