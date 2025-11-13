"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";
import { CONSTANTS } from "@/constants/constants";
import { API } from "@/constants";
import { fetchLogin } from "@/lib/api/auth/authApi";

export const LoginForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchLogin(JSON.stringify(formData));
      if (!response.success || !response.data) {
        setError(response.message || "Login failed.");
        setLoading(false);
        return;
      }

      // Redirect to home
      router.push(API.ROUTES.HOME);
      router.refresh();
    } catch (err) {
      setError("Server error occurred. Please try again.");
      setLoading(false);
    }
  };
  return (
    <div
      className={styles.container}
      style={{ minHeight: `calc(100vh - ${CONSTANTS.NAV_HEIGHT * 2}px)` }}
    >
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className={styles.linkContainer}>
            <span>Don&apos;t have an account? </span>
            <Link href={API.ROUTES.REGISTER} className={styles.link}>
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
