import { useEffect, useState } from "react";
import { getLeaderBoard } from "../api";

export const useLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [isTopTen, setIsTopTen] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const data = await getLeaderBoard();
        const rawLeaders = data.leaders.sort((a, b) => a.time - b.time);
        setLeaders(rawLeaders.slice(0, 10));
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Произошла непредвиденная ошибка. Обновите страницу";
        console.log(errMsg);
      }
    };
    fetchLeaders();
  }, []);

  const checkIsTopTen = value => {
    for (let i = 0; i < 10; i++) {
      if (leaders[i]["time"] > value) {
        setIsTopTen(true);
        return true;
      }
    }

    setIsTopTen(false);
    return false;
  };

  return { leaders, isTopTen, checkIsTopTen };
};
