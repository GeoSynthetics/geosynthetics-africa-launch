import { createContext, useContext, useState, type ReactNode } from "react";

interface QuickQuoteState {
  isOpen: boolean;
  productName: string | null;
  productId: string | null;
  open: (productName?: string, productId?: string) => void;
  close: () => void;
}

const QuickQuoteContext = createContext<QuickQuoteState | undefined>(undefined);

export function QuickQuoteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductName] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  const open = (pName?: string, pId?: string) => {
    setProductName(pName ?? null);
    setProductId(pId ?? null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setProductName(null);
    setProductId(null);
  };

  return (
    <QuickQuoteContext.Provider value={{ isOpen, productName, productId, open, close }}>
      {children}
    </QuickQuoteContext.Provider>
  );
}

export function useQuickQuote() {
  const ctx = useContext(QuickQuoteContext);
  if (!ctx) throw new Error("useQuickQuote must be used within QuickQuoteProvider");
  return ctx;
}
