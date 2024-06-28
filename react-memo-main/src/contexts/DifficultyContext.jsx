import React, { useState } from "react";

export const DifficultyContext = React.createContext({
  changeMode: () => {},
  mode: "hard",
  level: null,
  setLevel: () => {},
});

export function DifficultyProvider({ children }) {
  const [mode, setMode] = useState("hard");
  const [level, setLevel] = useState(null);

  const changeMode = () => {
    setMode(prevMode => (prevMode === "hard" ? "easy" : "hard"));
  };

  return (
    <DifficultyContext.Provider
      value={{
        changeMode,
        mode,
        setLevel,
        level,
      }}
    >
      {children}
    </DifficultyContext.Provider>
  );
}
