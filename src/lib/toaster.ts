import { toast, type ExternalToast } from "sonner";

type ToastOptions = Omit<ExternalToast, "position">;

const TOP_RIGHT_POSITION = "top-right" as const;

const BASE_TOAST_STYLE: React.CSSProperties = {
  borderRadius: "var(--radius-lg, 0.625rem)",
  fontSize: "0.8125rem",
  fontWeight: 500,
  padding: "12px 14px",
  boxShadow:
    "0 10px 25px -5px rgba(19, 17, 28, 0.12), 0 4px 10px -4px rgba(19, 17, 28, 0.06)",
};

function mergeOptions(
  customStyle: React.CSSProperties,
  options?: ToastOptions
): ExternalToast {
  return {
    position: TOP_RIGHT_POSITION,
    duration: 4000,
    ...options,
    style: {
      ...BASE_TOAST_STYLE,
      ...customStyle,
      ...options?.style,
    },
  };
}

export function showSuccessToast(message: string, options?: ToastOptions) {
  return toast.success(
    message,
    mergeOptions(
      {
        backgroundColor: "var(--success-tint, #ECFDF5)",
        color: "var(--success, #059669)",
        border: "1px solid color-mix(in srgb, var(--success, #059669) 35%, transparent)",
      },
      options
    )
  );
}

export function showErrorToast(message: string, options?: ToastOptions) {
  return toast.error(
    message,
    mergeOptions(
      {
        backgroundColor: "var(--destructive-tint, #FFF1F2)",
        color: "var(--destructive, #E11D48)",
        border:
          "1px solid color-mix(in srgb, var(--destructive, #E11D48) 35%, transparent)",
      },
      options
    )
  );
}

export function showWarningToast(message: string, options?: ToastOptions) {
  return toast.warning(
    message,
    mergeOptions(
      {
        backgroundColor: "var(--warning-tint, #FFFBEB)",
        color: "var(--warning, #D97706)",
        border: "1px solid color-mix(in srgb, var(--warning, #D97706) 35%, transparent)",
      },
      options
    )
  );
}

export function showInfoToast(message: string, options?: ToastOptions) {
  return toast.info(
    message,
    mergeOptions(
      {
        backgroundColor: "var(--accent-tint, #ECFEFF)",
        color: "var(--accent, #0891B2)",
        border: "1px solid color-mix(in srgb, var(--accent, #0891B2) 35%, transparent)",
      },
      options
    )
  );
}

export function showLoadingToast(message: string, options?: ToastOptions) {
  return toast.loading(
    message,
    mergeOptions(
      {
        backgroundColor: "var(--secondary, #F3EFFE)",
        color: "var(--primary, #5B21B6)",
        border: "1px solid color-mix(in srgb, var(--primary, #5B21B6) 30%, transparent)",
      },
      options
    )
  );
}

export function showPromiseToast<T>(
  promise: Promise<T> | (() => Promise<T>),
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  },
  options?: ToastOptions
) {
  return toast.promise(promise, {
    position: TOP_RIGHT_POSITION,
    ...messages,
    ...options,
  });
}

export function dismissToast(toastId?: string | number) {
  toast.dismiss(toastId);
}

export const appToaster = {
  success: showSuccessToast,
  error: showErrorToast,
  warning: showWarningToast,
  info: showInfoToast,
  loading: showLoadingToast,
  promise: showPromiseToast,
  dismiss: dismissToast,
};