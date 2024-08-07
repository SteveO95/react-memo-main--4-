import { useState } from "react";
import { LivesContext } from "../contexts/LivesContext";

const LivesProviders = ({ value, children }) => {
  const [lives, setLives] = useState(value);
  return <LivesContext.Provider value={{ lives, setLives }}>{children}</LivesContext.Provider>;
};

export default LivesProviders;
