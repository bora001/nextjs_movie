"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./verify-email.module.css";
import { API } from "@/constants";
import { fetchVerifyEmail } from "@/lib/api/auth/authApi";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    (typeof API.API_STATUS)[keyof typeof API.API_STATUS]
  >(API.API_STATUS.LOADING);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus(API.API_STATUS.ERROR);
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await fetchVerifyEmail(token);

        if (response.success && response.data) {
          setStatus(API.API_STATUS.SUCCESS);
          setMessage(response.message || "Email verification completed!");

          // Redirect to home after verification
          setTimeout(() => {
            router.push(API.ROUTES.HOME);
          }, 3000);
        } else {
          setStatus(API.API_STATUS.ERROR);
          setMessage(response.message || "Email verification failed.");
        }
      } catch (err) {
        setStatus(API.API_STATUS.ERROR);
        // .API_STATUS.ERROR);
        setMessage("Server error occurred. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {status === API.API_STATUS.LOADING && (
          <>
            <div className={styles.spinner}></div>
            <h1>Verifying email...</h1>
            <p>Please wait a moment.</p>
          </>
        )}

        {status === API.API_STATUS.SUCCESS && (
          <>
            <div className={styles.successIcon}>✓</div>
            <h1>Verification completed!</h1>
            <p>{message}</p>
            <p className={styles.redirectText}>
              Redirecting to home shortly...
            </p>
            <Link href={API.ROUTES.HOME} className={styles.link}>
              Go to home
            </Link>
          </>
        )}

        {status === API.API_STATUS.ERROR && (
          <>
            <div className={styles.errorIcon}>✗</div>
            <h1>Verification failed</h1>
            <p>{message}</p>
            <div className={styles.actions}>
              <Link href={API.ROUTES.REGISTER} className={styles.link}>
                Register again
              </Link>
              <Link href={API.ROUTES.LOGIN} className={styles.link}>
                Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
