import { createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

const ToastContext = createContext();
const BRAND_COLOR = "#13101A";

const TOAST_STYLE = {
  common: {
    backgroundColor: BRAND_COLOR,
    color: "#fff",
    padding: "16px",
    borderRadius: "6px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
  },
  processing: {
    borderLeft: "4px solid #facc15",
  },
  approve: {
    borderLeft: "4px solid #22c55e",
  },
  complete: {
    borderLeft: "4px solid #22c55e",
  },
  reject: {
    borderLeft: "4px solid #ef4444",
  },
  failed: {
    borderLeft: "4px solid #f97316",
  },
  info: {
    borderLeft: "4px solid #2ed3c0",
  },
};

export const ToastProvider = ({ children }) => {
  const showProcessing = (message) => {
    return toast.loading(message, {
      style: {
        ...TOAST_STYLE.common,
        ...TOAST_STYLE.processing,
      },
    });
  };
  const showApprove = (message) => {
    return toast.success(message, {
      style: {
        ...TOAST_STYLE.common,
        ...TOAST_STYLE.approve,
      },
      duration: 5000,
    });
  };
  const showComplete = (message) => {
    return toast.success(message, {
      style: {
        ...TOAST_STYLE.common,
        ...TOAST_STYLE.complete,
      },
      duration: 5000,
      icon: "✅",
    });
  };
  const showReject = (message) => {
    return toast.error(message, {
      style: {
        ...TOAST_STYLE.common,
        ...TOAST_STYLE.reject,
      },
      icon: "❌",
      duration: 5000,
    });
  };
  const showFailed = (message) => {
    return toast.error(message, {
      style: {
        ...TOAST_STYLE.common,
        ...TOAST_STYLE.failed,
      },
      duration: 5000,
      icon: "❌",
    });
  };
  const showInfo = (message) => {
    return toast(message, {
      style: {
        ...TOAST_STYLE.common,
        ...TOAST_STYLE.info,
      },
      duration: 4000,
    });
  };

  const updateToast = (id, state, message) => {
    toast.dismiss(id);
    switch (state) {
      case "approve":
        showApprove(message);
        break;
      case "complete":
        showComplete(message);
        break;
      case "reject":
        showReject(message);
        break;
      case "failed":
        showFailed(message);
        break;
      case "info":
      default:
        showInfo(message);
        break;
    }
  };

  const notify = {
    start: (messgae = "processing transaction...") => {
      return showProcessing(messgae);
    },
    update: (id, state, message) => {
      return updateToast(id, state, message);
    },
    approve: (id, message = "Transaction Approved") => {
      return updateToast(id, "approve", message);
    },
    complete: (id, message = "Transaction Completed Successfully") => {
      return updateToast(id, "complete", message);
    },
    reject: (id, message = "Transaction Rejected") => {
      return updateToast(id, "reject", message);
    },
    fail: (id, message = "Transaction Failed") => {
      return updateToast(id, "failed", message);
    },
  };

  return (
    <ToastContext.Provider
      value={{
        notify,
        toast,
        showProcessing,
        showApprove,
        showComplete,
        showReject,
        showFailed,
        showInfo,
        updateToast,
      }}
    >
      <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastContextProvider");
  }
  return context;
};
