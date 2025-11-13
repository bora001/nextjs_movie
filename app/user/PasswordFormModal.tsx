"use client";

import { useState } from "react";
import Modal from "@/component/Modal";
import styles from "./user.module.css";
import toast from "react-hot-toast";
import { fetchChangePassword } from "@/lib/api/auth/authApi";

interface PasswordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordFormModal({
  isOpen,
  onClose,
}: PasswordFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value,
    });
    setPasswordError("");
  };

  const validatePassword = (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const validations = [
      {
        condition: !currentPassword || !newPassword,
        message: "Please enter your current password and new password.",
      },
      {
        condition: newPassword.length < 6,
        message: "New password must be at least 6 characters.",
      },
      {
        condition: newPassword === currentPassword,
        message: "New password must be different from current password.",
      },
      {
        condition: newPassword !== confirmPassword,
        message: "New password and confirm password do not match.",
      },
    ];

    for (const v of validations) {
      if (v.condition) {
        return v.message;
      }
    }
    return null;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setLoading(true);

    // Validation
    const validationResult = validatePassword(
      passwordFormData.currentPassword,
      passwordFormData.newPassword,
      passwordFormData.confirmPassword
    );

    if (validationResult) {
      setPasswordError(validationResult);
      setLoading(false);
      return;
    }

    try {
      const response = await fetchChangePassword(
        JSON.stringify({
          currentPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword,
        })
      );

      if (!response.success) {
        setPasswordError(response.message || "Failed to change password.");
        setLoading(false);
        return;
      }

      toast.success("Password changed successfully!");
      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setLoading(false);
      onClose();
    } catch (err) {
      setPasswordError("Server error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPasswordError("");
    setPasswordFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Change Password</h2>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
          {passwordError && <div className={styles.error}>{passwordError}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="currentPassword" className={styles.label}>
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordFormData.currentPassword}
              onChange={handlePasswordChange}
              className={styles.input}
              required
              placeholder="Enter your current password"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordFormData.newPassword}
              onChange={handlePasswordChange}
              className={styles.input}
              required
              minLength={6}
              placeholder="Enter your new password (min 6 characters)"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordFormData.confirmPassword}
              onChange={handlePasswordChange}
              className={styles.input}
              required
              minLength={6}
              placeholder="Confirm your new password"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
