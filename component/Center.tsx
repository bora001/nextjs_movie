import { ReactNode } from "react";
import styles from "../styles/common.module.css";

const CENTER_TYPE = ["center", "start", "end"] as const;
type CenterType = (typeof CENTER_TYPE)[number];

const Center = ({
  children,
  type = "start",
}: {
  children: ReactNode;
  type?: CenterType;
}) => {
  return (
    <div className={styles.center_container} style={{ alignItems: type }}>
      {children}
    </div>
  );
};

export default Center;
