import styles from "../styles/modal.module.css";
export default function Modal(props) {
  return (
    <div className={styles.modal_cnt}>
      <div className={styles.modal_box}>{props.children}</div>
    </div>
  );
}
