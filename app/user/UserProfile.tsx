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
import { fetchDeleteUser } from "@/lib/api/auth/authApi";
import { getAxiosErrorMessage } from "@/lib/axios-error-handler";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleNameSuccess = (updatedUser: UserType) => {
    setCurrentUser(updatedUser);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");

    try {
      await fetchDeleteUser();
      setUser(null);
      fetchUser();
      router.push(API.ROUTES.HOME);
      router.refresh();
    } catch (err) {
      const errorMessage = getAxiosErrorMessage(
        err,
        "Failed to delete account. Please try again."
      );
      setError(errorMessage);
      setLoading(false);
      setShowDeleteConfirm(false);
    }
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
            <Link href={API.ROUTES.HOME} className={styles.homeLink}>
              Back to Home
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={styles.deleteButton}
              disabled={loading}
            >
              Delete Account
            </button>
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

      {showDeleteConfirm && (
        <div
          className={styles.modalOverlay}
          onClick={() => !loading && setShowDeleteConfirm(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Delete Account</h2>
            </div>
            <p className={styles.deleteWarning}>
              Are you sure you want to delete your account? This action cannot
              be undone. All your data, including liked movies, will be
              permanently deleted.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={handleDeleteAccount}
                className={styles.confirmDeleteButton}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete Account"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.cancelButton}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
