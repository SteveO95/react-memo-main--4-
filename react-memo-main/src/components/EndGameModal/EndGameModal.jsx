import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setLeader } from "../../api";

import Icon from "../Icon/Icon";
import { sanitizeValue } from "../../utils/sanitizeValue";

export function EndGameModal({
  isWon,
  isLeaderboard,
  gameDurationSeconds,
  gameDurationMinutes,
  isOneLive = false,
  isWithoutPower = false,
  onClick,
}) {
  const [userName, setUserName] = useState("");
  const [dataSave, setDataSave] = useState(false);
  const navigate = useNavigate();

  const title = isLeaderboard && isWon ? "Вы попали на лидерборд!" : isWon ? "Вы победили!" : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const saveResult = async onClick => {
    if (!isWon || !isLeaderboard) {
      onClick();
      return;
    }
    const clearUserName = sanitizeValue(userName);
    if (clearUserName.length < 1) {
      alert("Пожалуйста, укажите имя прежде чем продолжить");
      return;
    }

    if (dataSave) {
      onClick();
      return;
    }

    try {
      let achievements = [];
      if (isOneLive) achievements.push(1);
      if (isWithoutPower) achievements.push(2);

      await setLeader({
        name: clearUserName,
        time: parseInt(gameDurationMinutes * 60 + gameDurationSeconds),
        achievements: achievements,
      });
      setDataSave(true);
      onClick();
    } catch (e) {
      let err = e instanceof Error ? e.message : "Ошибка записи!";
      alert(`${err}\nПопробуйте снова!`);
    }
  };

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {isLeaderboard && isWon && (
        <div>
          <input
            type="text"
            placeholder="Ваше имя"
            className={styles.leaderName}
            value={userName}
            onChange={e => setUserName(e.target.value)}
            disabled={dataSave}
          />
        </div>
      )}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <div className={styles.buttonsContainer}>
        {isLeaderboard && isWon && (
          <>
            <Button
              onClick={() =>
                saveResult(() => {
                  return;
                })
              }
            >
              <Icon iconName={dataSave ? "thumb_up" : "save"} width={"20px"} height={"20px"} color={"#fff"} />
              {dataSave ? "Сохранено" : "Сохранить"}
            </Button>
            <Button onClick={() => saveResult(() => navigate("/leaderboard"))}>К лидерборду</Button>
          </>
        )}

        <Button onClick={() => saveResult(onClick)}>Начать сначала</Button>
        <Button onClick={() => saveResult(() => navigate("/"))}>На главную</Button>
      </div>
    </div>
  );
}
