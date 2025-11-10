"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./verify-email.module.css";
import { CONSTANTS } from "@/constants/constants";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    (typeof CONSTANTS.API_STATUS)[keyof typeof CONSTANTS.API_STATUS]
  >(CONSTANTS.API_STATUS.LOADING);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus(CONSTANTS.API_STATUS.ERROR);
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await fetch(
          `${CONSTANTS.ROUTES.API.AUTH.VERIFY_EMAIL}?token=${token}`
        );
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus(CONSTANTS.API_STATUS.SUCCESS);
          setMessage(data.message || "Email verification completed!");

          // Redirect to home after verification
          setTimeout(() => {
            router.push(CONSTANTS.ROUTES.HOME);
          }, 3000);
        } else {
          setStatus(CONSTANTS.API_STATUS.ERROR);
          setMessage(data.message || "Email verification failed.");
        }
      } catch (err) {
        setStatus(CONSTANTS.API_STATUS.ERROR);
        setMessage("Server error occurred. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {status === CONSTANTS.API_STATUS.LOADING && (
          <>
            <div className={styles.spinner}></div>
            <h1>Verifying email...</h1>
            <p>Please wait a moment.</p>
          </>
        )}

        {status === CONSTANTS.API_STATUS.SUCCESS && (
          <>
            <div className={styles.successIcon}>✓</div>
            <h1>Verification completed!</h1>
            <p>{message}</p>
            <p className={styles.redirectText}>
              Redirecting to home shortly...
            </p>
            <Link href={CONSTANTS.ROUTES.HOME} className={styles.link}>
              Go to home
            </Link>
          </>
        )}

        {status === CONSTANTS.API_STATUS.ERROR && (
          <>
            <div className={styles.errorIcon}>✗</div>
            <h1>Verification failed</h1>
            <p>{message}</p>
            <div className={styles.actions}>
              <Link href={CONSTANTS.ROUTES.REGISTER} className={styles.link}>
                Register again
              </Link>
              <Link href={CONSTANTS.ROUTES.LOGIN} className={styles.link}>
                Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
