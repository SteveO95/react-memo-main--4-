import { shuffle } from "lodash";
import { useEffect, useRef, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { getTimerValue } from "../../utils/getTimerValue";
import Icon from "../Icon/Icon";
import classNames from "classnames";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Пауза игры: по желанию игрока или использования суперсилы
const STATUS_PAUSE = "STATUS_PAUSE";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 1, lives = 1 }) {
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);

  // Отображаемые пользователю карты
  const displayedCards = useRef(cards);

  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);

  // Количество жизней
  const [gameLives, setGameLives] = useState(lives > 0 ? lives : 1);

  // Прерыдущая открытая карта, которую необходимо будет перевернуть обратно
  const [previousCardIndex, setPreviousCardIndex] = useState();

  // Использованы ли суперсилы
  const [isWithoutPower, setIsWithoutPower] = useState(true);

  // Суперсила Показать все карты
  const [seeAll, setSeeAll] = useState(true);

  // Суперсила Открыть пару карт
  const [openOnePair, setOpenOnePair] = useState(true);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }

  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
    setSeeAll(true);
    setOpenOnePair(true);
  }

  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setGameLives(lives);
    setStatus(STATUS_PREVIEW);
    setSeeAll(true);
    setOpenOnePair(true);
  }

  // Суперсила "Показать все карты"
  const handleSeeAll = () => {
    if (!seeAll) return;

    displayedCards.current = cards.map(card => {
      return { ...card, open: true };
    });

    setSeeAll(false);
    setIsWithoutPower(false);
    setStatus(STATUS_PAUSE);

    setTimeout(() => {
      setGameStartDate(current => new Date(current.getTime() + 5000));

      setCards(cards => {
        displayedCards.current = cards;
        return cards;
      });

      setStatus(STATUS_IN_PROGRESS);
    }, 4500);
  };

  // Суперсила "Открыть пару карт"
  const handleOpenOnePair = () => {
    if (!openOnePair) return;

    let newCards;
    for (;;) {
      const cardToOpen = cards[Math.floor(Math.random() * cards.length)];
      const cardToOpenIndex = cards.findIndex(card => card.id === cardToOpen.id);

      if (!cardToOpen.open) {
        newCards = cards.map((card, index) => {
          if (index === cardToOpenIndex) return { ...card, open: true };
          if (card.rank === cardToOpen.rank && card.suit === cardToOpen.suit) return { ...card, open: true };
          return card;
        });

        setCards(newCards);

        break;
      }
    }

    setOpenOnePair(false);
    setIsWithoutPower(false);
    if (newCards.every(card => card.open)) finishGame(STATUS_WON);
  };

  // Необходима для работы "Показать все карты"
  useEffect(() => {
    displayedCards.current = cards;
  }, [cards]);

  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) return;

    let currentIndex = null;
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map((card, index) => {
      if (card.id !== clickedCard.id) {
        return card;
      } else {
        currentIndex = index;
        setPreviousCardIndex(index);
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    const playerLost = openCardsWithoutPair.length >= 2;
    // -Жизнь
    if (playerLost) {
      const newCards = [...cards];
      const firstCard = { ...newCards[currentIndex], open: false };
      const secondCard = { ...newCards[previousCardIndex], open: false };
      newCards[currentIndex] = firstCard;
      newCards[previousCardIndex] = secondCard;

      setTimeout(() => {
        setGameLives(gameLives => gameLives - 1);
        setCards(newCards);
        setPreviousCardIndex(null);

        // Игрок проиграл,закончились жизни
        if (gameLives - 1 === 0) {
          finishGame(STATUS_LOST);
          return;
        }
      }, 500);
    }

    // игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера
  useEffect(() => {
    const intervalId = setInterval(() => {
      if ([STATUS_PAUSE, STATUS_WON, STATUS_LOST].includes(status)) return;
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);

    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate, status]);

  // Количество жизней
  const hearts = [];
  for (let i = 1; i <= gameLives; i++) {
    hearts.push(<img key={i} className={styles.live} src={`${process.env.PUBLIC_URL}/logo192.png`} alt="live" />);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {[STATUS_IN_PROGRESS, STATUS_PAUSE].includes(status) && (
          <>
            <div className={styles.powers}>
              <div
                className={classNames({ [styles.powerTooltip]: true, [styles.powerUsed]: !seeAll })}
                onClick={handleSeeAll}
              >
                <span className={styles.powerTooltipText}>
                  <strong>Прозрение</strong>
                  <br />
                  На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.
                </span>
                <Icon className={seeAll && styles.powerUsed} iconName={"eye"} width={"68px"} height={"68px"} />
              </div>

              <div
                className={classNames({ [styles.powerTooltip]: true, [styles.powerUsed]: !openOnePair })}
                onClick={handleOpenOnePair}
              >
                <span className={styles.powerTooltipText}>
                  <strong>Алохомора</strong>
                  <br />
                  Открывается случайная пара карт.
                </span>
                <Icon iconName={"cards-pair"} width={"68px"} height={"68px"} />
              </div>

              <div className={styles.powerTooltipOverlay}></div>
            </div>

            <Button
              onClick={() => {
                finishGame(STATUS_WON);
              }}
            >
              WIN
            </Button>

            <div className={styles.headerContainer}>
              <div className={styles.gameLives}>{hearts}</div>
              <Button onClick={resetGame}>Начать заново</Button>
            </div>
          </>
        )}
      </div>

      <div className={styles.cards}>
        {displayedCards.current.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            isLeaderboard={pairsCount >= 9}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            isOneLive={lives === 1}
            isWithoutPower={isWithoutPower}
            onClick={resetGame}
          />
        </div>
      ) : null}
    </div>
  );
}
