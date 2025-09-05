// LanguageContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface LanguageContextType {
  isEng: boolean;
  setIsEng: (value: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [isEng, setIsEng] = useState(true); // default English

  return (
    <LanguageContext.Provider value={{ isEng, setIsEng }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};