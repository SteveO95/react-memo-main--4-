import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./LeaderBoardPage.module.css";
import { useEffect, useState } from "react";
import { getLeaders } from "../../api";

export function LeaderBoardPage() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    getLeaders()
      .then(data => {
        let leader = data.leaders;
        leader = leader.sort(function (a, b) {
          return a.time - b.time;
        });
        setLeaders(leader);
      })
      .catch(error => {
        console.log(error.message);
      });
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.text}>Лидерборд</p>
        <Link to="/">
          <Button>Начать игру</Button>
        </Link>
      </div>
      <table>
        <thead className={styles.th}>
          <tr className={styles.leaders}>
            <th>Позиция</th>
            <th>Пользователь</th>
            <th>Время</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {leaders.map((leader, index) => (
            <tr className={styles.sleader} key={leader.id}>
              <td>#{index + 1}</td>
              <td>{leader.name}</td>
              <td>{leader.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
