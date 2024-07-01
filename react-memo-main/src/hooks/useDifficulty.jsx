import { useContext } from "react";
import { DifficultyContext } from "../contexts/DifficultyContext";

export default function useMode() {
  return useContext(DifficultyContext);
}
