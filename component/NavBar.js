import Link from "next/link";
import SearchBox from "./SearchBox";
import styles from "../styles/nav.module.css";

export default function NavBar() {
  return (
    <div className={styles.nav}>
      <div className={styles.nav_menu}>
        <Link href="/">Home</Link>
        <Link href="/popular">Popular Movies</Link>
        <Link href="/top-rated">Top Rated Movies</Link>
        <Link href="/now-playing">Now Playing</Link>
        <Link href="/up-coming">Upcoming</Link>
      </div>
      <SearchBox />
    </div>
  );
}
