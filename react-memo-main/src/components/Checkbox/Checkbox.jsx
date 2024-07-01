import styles from "./Checkbox.module.css";

export function Checkbox({ children, onClick }) {
  return (
    <div>
      <input type="checkbox" id="mode" className={styles.checkbox} onClick={onClick} />
      <label htmlFor="mode">{children}</label>
    </div>
  );
}
