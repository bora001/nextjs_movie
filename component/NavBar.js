import Link from "next/link";
import SearchBox from "./SearchBox";
import styles from "../styles/nav.module.css";
export default function NavBar() {
  return (
    <div className={styles.nav}>
      <div className={styles.nav_menu}>
        <Link href="/">Home</Link>
        <SearchBox />
        <hr className="mo_br" />
        <Link href="/popular">Popular Movies</Link>
        <Link href="/top_rated">Top Rated Movies</Link>
        <Link href="/now_playing">Now Playing</Link>
        <Link href="/upcoming">Upcoming</Link>
      </div>
      {/* <SearchBox /> */}
    </div>
  );
}
