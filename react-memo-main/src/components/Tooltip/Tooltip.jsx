import styles from "./Tooltip.module.css";
const Tooltip = ({ message, children }) => {
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipText}>{message}</span>
      {children}
    </div>
  );
};

export default Tooltip;
