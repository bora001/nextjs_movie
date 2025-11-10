"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";
import { CONSTANTS } from "@/constants/constants";

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSendVerificationCode = async () => {
    setError("");
    setVerificationLoading(true);

    // Email validation
    if (!formData.email || !CONSTANTS.REGEX.EMAIL.test(formData.email)) {
      setError("Please enter a valid email address.");
      setVerificationLoading(false);
      return;
    }

    try {
      const response = await fetch(
        CONSTANTS.ROUTES.API.AUTH.SEND_VERIFICATION_CODE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to send verification code.");
        setVerificationLoading(false);
        return;
      }

      setVerificationCodeSent(true);
      setVerificationLoading(false);
    } catch (err) {
      setError("Server error occurred. Please try again.");
      setVerificationLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError("");
    setVerifyingCode(true);

    if (!formData.verificationCode || formData.verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      setVerifyingCode(false);
      return;
    }

    try {
      const response = await fetch(CONSTANTS.ROUTES.API.AUTH.VERIFY_CODE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid verification code.");
        setVerifyingCode(false);
        return;
      }

      setEmailVerified(true);
      setVerifyingCode(false);
    } catch (err) {
      setError("Server error occurred. Please try again.");
      setVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.email || !formData.name || !formData.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (!emailVerified) {
      setError("Please verify your email first.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(CONSTANTS.ROUTES.API.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(CONSTANTS.ROUTES.HOME);
        router.refresh();
      }, 2000);
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
        <h1 className={styles.title}>Register</h1>

        {success ? (
          <div className={styles.successMessage}>
            <p>Registration information received!</p>
            <p>
              Please check your email to verify your account and complete
              registration.
            </p>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
              After clicking the verification link in your email, your
              registration will be completed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                  disabled={emailVerified}
                  style={{
                    flex: 1,
                    ...(emailVerified && {
                      backgroundColor: "#f5f5f5",
                      cursor: "not-allowed",
                    }),
                  }}
                />
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={
                    verificationLoading || emailVerified || !formData.email
                  }
                  style={{
                    padding: "10px 20px",
                    backgroundColor: emailVerified ? "#ccc" : "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor:
                      emailVerified || !formData.email
                        ? "not-allowed"
                        : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {verificationLoading
                    ? "Sending..."
                    : emailVerified
                    ? "Verified ✓"
                    : "Verify Email"}
                </button>
              </div>
              {emailVerified && (
                <span
                  style={{ color: "green", fontSize: "12px", marginTop: "5px" }}
                >
                  ✓ Email verified
                </span>
              )}
            </div>

            {verificationCodeSent && !emailVerified && (
              <div className={styles.formGroup}>
                <label htmlFor="verificationCode">Verification Code</label>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={
                      verifyingCode || formData.verificationCode.length !== 6
                    }
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor:
                        verifyingCode || formData.verificationCode.length !== 6
                          ? "not-allowed"
                          : "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {verifyingCode ? "Verifying..." : "Verify"}
                  </button>
                </div>
                <p
                  style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}
                >
                  Enter the 6-digit code sent to your email
                </p>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
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
                placeholder="least 6 characters"
                minLength={6}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !emailVerified}
            >
              {loading ? "Processing..." : "Register"}
            </button>

            <div className={styles.linkContainer}>
              <span>Already have an account? </span>
              <Link href={CONSTANTS.ROUTES.LOGIN} className={styles.link}>
                Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
