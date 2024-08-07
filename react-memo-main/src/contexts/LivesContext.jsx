import { createContext, useContext } from "react";

export const LivesContext = createContext(null);

export const useLivesContext = () => {
  const lives = useContext(LivesContext);

  if (!lives) {
    throw new Error("Lives not set");
  }

  return lives;
};
