import { createContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { I18N_NAMESPACES } from "../i18n";
import { RotatingLines } from "react-loader-spinner";

type LoadingContextType = {
  show: (message?: string) => void;
  hide: () => void;
};

export const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { t } = useTranslation(I18N_NAMESPACES.COMMON);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const show = (msg = t("status.loading")) => {
    setMessage(msg);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return (
    <LoadingContext.Provider value={{ show, hide }}>
      {children}

      {visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex gap-2 items-center bg-bg-card text-black px-4 py-4 rounded">
            <RotatingLines
              visible={true}
              height="32"
              width="32"
              color="green"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <span className="text-white">{message}</span>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};
