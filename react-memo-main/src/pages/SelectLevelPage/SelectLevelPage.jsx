import styles from "./SelectLevelPage.module.css";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import { Button } from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import useDifficulty from "../../hooks/useDifficulty";

export function SelectLevelPage() {
  const { mode, changeMode, level, setLevel } = useDifficulty();
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate(`/game/${level}`, { state: { mode } });
    console.log(mode);
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <form className={styles.levels}>
          <label className={styles.level}>
            <input type="radio" value="3" checked={level === 3} onChange={e => setLevel(e.target.value)} />
            <div className={styles.levelText}>1</div>
          </label>
          <br />
          <label className={styles.level}>
            <input type="radio" value="6" checked={level === 6} onChange={e => setLevel(e.target.value)} />
            <div className={styles.levelText}>2</div>
          </label>
          <br />
          <label className={styles.level}>
            <input type="radio" value="9" checked={level === 9} onChange={e => setLevel(e.target.value)} />
            <div className={styles.levelText}>3</div>
          </label>
        </form>
        <Checkbox className={styles.mode} onClick={changeMode}>
          Легкий режим (3 жизни)
        </Checkbox>
        {level === null ? <button disabled>Играть</button> : <Button onClick={handlePlayClick}>Играть</Button>}
        <Link to="/leaderboard" className={styles.linkBoard}>
          Перейти к лидерборду
        </Link>
      </div>
    </div>
  );
}
