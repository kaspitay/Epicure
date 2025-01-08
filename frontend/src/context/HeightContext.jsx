import { createContext, useContext, useState, useEffect } from "react";

const HeightContext = createContext();

export const useHeightContext = () => {
  return useContext(HeightContext);
};

export const HeightProvider = ({ children }) => {
  const [containerHeight, setContainerHeight] = useState(0);
  useEffect(() => {
    // Function to update container height based on viewport height
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const filterMenuHeight =
        document.getElementById("filter-menu")?.offsetHeight || 0;
      const newContainerHeight = windowHeight - filterMenuHeight;
      setContainerHeight(newContainerHeight);
    };

    // Call the function initially and add event listener for window resize
    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);

    // Cleanup function to remove event listener on unmount
    return () => window.removeEventListener("resize", updateContainerHeight);
  }, []);

  return (
    <HeightContext.Provider value={{ containerHeight }}>
      {children}
    </HeightContext.Provider>
  );
};
