"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SearchBox from "./SearchBox";
import AuthButton from "./AuthButton";
import styles from "../../styles/nav.module.css";
import { CONSTANTS } from "@/constants/constants";
import { UserType } from "@/types/user";
import { API } from "@/constants";
import { Menu, X } from "lucide-react";

export default function NavBar({ user }: { user: UserType | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  const navLinks = [
    { href: API.ROUTES.HOME, label: "Home" },
    { href: API.ROUTES.POPULAR, label: "Popular Movies" },
    { href: API.ROUTES.TOP_RATED, label: "Top Rated Movies" },
    { href: API.ROUTES.NOW_PLAYING, label: "Now Playing" },
    { href: API.ROUTES.UPCOMING, label: "Upcoming" },
  ];

  if (user) {
    navLinks.push({ href: API.ROUTES.LIKED_MOVIES, label: "Liked Movies" });
  }

  return (
    <div className={styles.nav} style={{ height: CONSTANTS.NAV_HEIGHT }}>
      <div className={styles.nav_content}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <SearchBox />
        <AuthButton user={user} />
      </div>

      {/* Mobile Menu Button */}
      <button
        className={styles.mobile_menu_button}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobile_menu_overlay} onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu */}
      <div
        className={`${styles.mobile_menu} ${
          isMobileMenuOpen ? styles.mobile_menu_open : ""
        }`}
      >
        <div className={styles.mobile_menu_content}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
          <div className={styles.mobile_actions}>
            <SearchBox />
            <AuthButton user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
