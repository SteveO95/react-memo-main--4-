import styles from "./Button.module.css";

export function Button({ children, onClick, customClass = null }) {
  return (
    <button onClick={onClick} className={customClass || styles.button}>
      {children}
    </button>
  );
}
