import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Страница не найдена</h1>
        <Link to={"/"}>
          <Button>На главную</Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
