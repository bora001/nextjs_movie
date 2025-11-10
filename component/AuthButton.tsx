"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./AuthButton.module.css";
import { useAuthStore } from "@/store/useAuthStore";
import { UserType } from "@/types/user";
import { API } from "@/constants";

export default function AuthButton({
  user: loginUser,
}: {
  user: UserType | null;
}) {
  const router = useRouter();
  const { user: storeUser, fetchUser, setUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Use store user if available, otherwise fallback to prop user
  const user = storeUser || loginUser;

  const handleLogout = async () => {
    try {
      await fetch(API.ROUTES.API.AUTH.LOGOUT, { method: "POST" });
      setUser(null);
      fetchUser();
      router.push(API.ROUTES.HOME);
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (user) {
    return (
      <div className={styles.authContainer}>
        <>
          <Link href={API.ROUTES.USER} className={styles.userName}>
            {user.name}
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <Link href={API.ROUTES.LOGIN} className={styles.loginLink}>
        Login
      </Link>
      <Link href={API.ROUTES.REGISTER} className={styles.registerLink}>
        Register
      </Link>
    </div>
  );
}
