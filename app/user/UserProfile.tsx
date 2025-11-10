"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./user.module.css";
import { UserType } from "@/types/user";
import { API } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { CONSTANTS } from "@/constants/constants";
import PasswordFormModal from "./PasswordFormModal";
import NameFormModal from "./NameFormModal";

interface UserProfileProps {
  user: UserType;
}

export default function UserProfile({ user }: UserProfileProps) {
  const router = useRouter();
  const { setUser, fetchUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType>(user);

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      await fetch(API.ROUTES.API.AUTH.LOGOUT, { method: "POST" });
      setUser(null);
      fetchUser();
      router.push(API.ROUTES.HOME);
      router.refresh();
    } catch (err) {
      setError("Logout failed. Please try again.");
      setLoading(false);
    }
  };

  const handleNameSuccess = (updatedUser: UserType) => {
    setCurrentUser(updatedUser);
  };

  return (
    <div
      className={styles.container}
      style={{ minHeight: `calc(100vh - ${CONSTANTS.NAV_HEIGHT * 2}px)` }}
    >
      <div className={styles.profileWrapper}>
        <h1 className={styles.title}>User Profile</h1>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.profileContent}>
          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <label className={styles.label}>Email</label>
              <div className={`${styles.value} ${styles.emailValue}`}>
                {user.email}
              </div>
            </div>

            <div className={styles.infoItem}>
              <label className={styles.label}>Name</label>
              <div className={styles.nameSection}>
                <div className={styles.value}>{currentUser.name}</div>
                <button
                  onClick={() => setShowNameForm(true)}
                  className={styles.toggleButton}
                >
                  Change Name
                </button>
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className={styles.toggleButton}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <div className={styles.actionsSection}>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
            <Link href={API.ROUTES.HOME} className={styles.homeLink}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <PasswordFormModal
        isOpen={showPasswordForm}
        onClose={() => setShowPasswordForm(false)}
      />

      <NameFormModal
        isOpen={showNameForm}
        onClose={() => setShowNameForm(false)}
        currentName={currentUser.name}
        onSuccess={handleNameSuccess}
      />
    </div>
  );
}
