import { LoaderCircle } from "lucide-react";
import styles from "../styles/common.module.css";
import Center from "./Center";

const LoadingSpinner = () => {
  return (
    <Center>
      <LoaderCircle className={styles.spinner} />
    </Center>
  );
};

export default LoadingSpinner;
