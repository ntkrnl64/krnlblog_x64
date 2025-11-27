import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocContextType {
  toc: TocItem[];
  setToc: (toc: TocItem[]) => void;
}

const TocContext = createContext<TocContextType | undefined>(undefined);

export function TocProvider({ children }: { children: ReactNode }) {
  const [toc, setToc] = useState<TocItem[]>([]);

  return (
    <TocContext.Provider value={{ toc, setToc }}>
      {children}
    </TocContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToc() {
  const context = useContext(TocContext);
  if (context === undefined) {
    throw new Error("useToc must be used within a TocProvider");
  }
  return context;
}
