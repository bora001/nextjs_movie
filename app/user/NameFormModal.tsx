"use client";

import { useState } from "react";
import Modal from "@/component/Modal";
import styles from "./user.module.css";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { UserType } from "@/types/user";
import { fetchChangeName } from "@/lib/api/auth/authApi";

interface NameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSuccess?: (updatedUser: UserType) => void;
}

export default function NameFormModal({
  isOpen,
  onClose,
  currentName,
  onSuccess,
}: NameFormModalProps) {
  const { setUser, fetchUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [nameFormData, setNameFormData] = useState({
    newName: "",
  });
  const [nameError, setNameError] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFormData({
      ...nameFormData,
      [e.target.name]: e.target.value,
    });
    setNameError("");
  };
  const validateName = (newName: string, currentName: string) => {
    const validations = [
      {
        condition: !newName || newName.trim().length === 0,
        message: "Please enter a new name.",
      },
      {
        condition: newName.length < 2,
        message: "Name must be at least 2 characters.",
      },
      {
        condition: newName.length > 50,
        message: "Name must be less than 50 characters.",
      },
      {
        condition: newName === currentName,
        message: "New name must be different from current name.",
      },
    ];
    for (const v of validations) {
      if (v.condition) {
        return v.message;
      }
    }
    return null;
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");
    setLoading(true);

    // Validation

    const trimmedName = nameFormData.newName.trim();

    // Validation
    const validationResult = validateName(trimmedName, currentName);
    if (validationResult) {
      setNameError(validationResult);
      setLoading(false);
      return;
    }

    try {
      const response = await fetchChangeName(
        JSON.stringify({ name: trimmedName })
      );

      if (!response.success || !response.data) {
        setNameError(response.message || "Failed to change name.");
        setLoading(false);
        return;
      }

      toast.success("Name changed successfully!");
      setNameFormData({
        newName: "",
      });
      setLoading(false);

      // Update user state with the updated user information from response
      if (response.data?.user) {
        setUser(response.data.user);
        if (onSuccess) {
          onSuccess(response.data.user);
        }
      } else {
        // Fallback: refresh user data from server
        await fetchUser();
      }
      onClose();
    } catch (err) {
      setNameError("Server error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNameError("");
    setNameFormData({
      newName: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Change Name</h2>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleNameSubmit} className={styles.passwordForm}>
          {nameError && <div className={styles.error}>{nameError}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="currentName" className={styles.label}>
              Current Name
            </label>
            <input
              type="text"
              id="currentName"
              value={currentName}
              className={styles.input}
              disabled
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newName" className={styles.label}>
              New Name
            </label>
            <input
              type="text"
              id="newName"
              name="newName"
              value={nameFormData.newName}
              onChange={handleNameChange}
              className={styles.input}
              required
              minLength={2}
              maxLength={50}
              placeholder="Enter your new name (2-50 characters)"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Name"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
