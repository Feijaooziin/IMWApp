// context/DrawerContext.tsx
import { createContext, useContext, useState } from "react";

type DrawerContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const DrawerContext = createContext<DrawerContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DrawerContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

export const useDrawerState = () => useContext(DrawerContext);
