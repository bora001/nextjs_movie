import Link from "next/link";
import styles from "../styles/nav.module.css";

export default function NavBar() {
  return (
    <div className={styles.nav}>
      <Link href="/">Popular Movies</Link>
      <Link href="/top-rated">Top Rated Movies</Link>
      <Link href="/now-playing">Now Playing</Link>
      <Link href="/up-coming">Upcoming</Link>
    </div>
  );
}
