"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./AuthButton.module.css";
import { useAuthStore } from "@/store/useAuthStore";
import { UserType } from "@/types/user";
import { CONSTANTS } from "@/constants/constants";

export default function AuthButton({
  user: loginUser,
}: {
  user: UserType | null;
}) {
  const router = useRouter();
  const { fetchUser, setUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    try {
      await fetch(CONSTANTS.ROUTES.API.AUTH.LOGOUT, { method: "POST" });
      setUser(null);
      fetchUser();
      router.push(CONSTANTS.ROUTES.HOME);
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loginUser) {
    return (
      <div className={styles.authContainer}>
        <>
          <span className={styles.userName}>{loginUser.name}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <Link href={CONSTANTS.ROUTES.LOGIN} className={styles.loginLink}>
        Login
      </Link>
      <Link href={CONSTANTS.ROUTES.REGISTER} className={styles.registerLink}>
        Register
      </Link>
    </div>
  );
}
