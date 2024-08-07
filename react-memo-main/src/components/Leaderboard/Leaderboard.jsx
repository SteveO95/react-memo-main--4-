import classNames from "classnames";
import { serializeTrackTime } from "../../utils/serializeTrackTime";
import styles from "./Leaderboard.module.css";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import Icon from "../../components/Icon/Icon";
import Tooltip from "../Tooltip/Tooltip";

const achivments = [
  { id: 1, message: "Игра пройдена в сложном режиме", earned: "puzzle-color", failed: "puzzle-shape" },
  { id: 2, message: "Игра пройдена без суперсил", earned: "magic-ball-color", failed: "magic-ball-shape" },
];

const Leaderboard = () => {
  const { leaders } = useLeaderboard();
  return (
    <>
      <div className={classNames(styles.leaderboardCard, styles.leaderboardCardTitle)}>
        <p className={classNames(styles.leaderboardText, styles.leaderboardTitleText)}>Позиция</p>
        <p className={classNames(styles.leaderboardText, styles.leaderboardTitleText)}>Пользователь</p>
        <p className={classNames(styles.leaderboardText, styles.leaderboardTitleText)}>Достижения</p>
        <p className={classNames(styles.leaderboardText, styles.leaderboardTitleText)}>Время</p>
      </div>
      <div className={styles.leaderboardWrapper}>
        {Array.isArray(leaders) ? (
          leaders.map((leader, index) => (
            <div className={styles.leaderboardCard} key={index}>
              <p className={styles.leaderboardText}>#{index + 1}</p>
              <p className={styles.leaderboardText}>{leader.name}</p>
              <div className={styles.leaderboardAchivments}>
                {achivments.map((achivment, index) => {
                  const earned = leader.achievements.includes(achivment.id);

                  if (!earned) return <Icon key={index} iconName={achivment.failed} width={"30px"} height={"30px"} />;
                  return (
                    <Tooltip key={index} message={achivment.message}>
                      <Icon iconName={achivment.earned} width={"32px"} height={"32px"} />
                    </Tooltip>
                  );
                })}
              </div>
              <p className={styles.leaderboardText}>{serializeTrackTime(leader.time)}</p>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Leaderboard;
