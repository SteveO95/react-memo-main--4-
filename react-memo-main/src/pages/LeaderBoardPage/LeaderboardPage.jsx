import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import styles from "./LeaderboardPage.module.css";

const LeaderboardPage = () => {
  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Лидербоард</h1>
          <Link to={"/"}>
            <Button>Начать игру</Button>
          </Link>
        </header>
        <Leaderboard />
      </div>
    </>
  );
};

export default LeaderboardPage;
