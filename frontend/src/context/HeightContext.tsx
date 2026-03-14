import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface HeightContextType {
  containerHeight: number;
}

const HeightContext = createContext<HeightContextType | null>(null);

export const useHeightContext = (): HeightContextType => {
  const context = useContext(HeightContext);
  if (!context) {
    throw new Error('useHeightContext must be used within a HeightProvider');
  }
  return context;
};

interface HeightProviderProps {
  children: ReactNode;
}

export const HeightProvider = ({ children }: HeightProviderProps) => {
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const filterMenuHeight = document.getElementById('filter-menu')?.offsetHeight || 0;
      const newContainerHeight = windowHeight - filterMenuHeight;
      setContainerHeight(newContainerHeight);
    };

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);

    return () => window.removeEventListener('resize', updateContainerHeight);
  }, []);

  return (
    <HeightContext.Provider value={{ containerHeight }}>{children}</HeightContext.Provider>
  );
};
