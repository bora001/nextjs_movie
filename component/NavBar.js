import Link from "next/link";
import styles from "../styles/nav.module.css";

export default function NavBar() {
  return (
    <div className={styles.nav}>
      <Link href="/">Popular Movies</Link>
    </div>
  );
}
