import styles from "../styles/modal.module.css";
import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
}

export default function Modal({ children }: ModalProps) {
  return (
    <div className={styles.modal_cnt}>
      <div className={styles.modal_box}>{children}</div>
    </div>
  );
}
