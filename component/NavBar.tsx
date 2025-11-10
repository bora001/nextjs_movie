import Link from "next/link";
import SearchBox from "./SearchBox";
import AuthButton from "./AuthButton";
import styles from "../styles/nav.module.css";
import { CONSTANTS } from "@/constants/constants";
import { UserType } from "@/types/user";

export default function NavBar({ user }: { user: UserType | null }) {
  return (
    <div className={styles.nav} style={{ height: CONSTANTS.NAV_HEIGHT }}>
      <div className={styles.nav_menu}>
        <Link href={CONSTANTS.ROUTES.HOME}>Home</Link>
        <SearchBox />
        <hr className="mo_br" />
        <Link href={CONSTANTS.ROUTES.POPULAR}>Popular Movies</Link>
        <Link href={CONSTANTS.ROUTES.TOP_RATED}>Top Rated Movies</Link>
        <Link href={CONSTANTS.ROUTES.NOW_PLAYING}>Now Playing</Link>
        <Link href={CONSTANTS.ROUTES.UPCOMING}>Upcoming</Link>
        <AuthButton user={user} />
      </div>
    </div>
  );
}
