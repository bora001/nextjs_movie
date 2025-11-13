import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";
import { UserType } from "@/types/user";
import NavBar from "@/component/navBar/NavBar";
import Center from "@/component/Center";
import { Construction } from "lucide-react";
import LoadingSpinner from "@/component/LoadingSpinner";
import Button from "@/component/Button";

export const ErrorBoundaryProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: UserType | null;
}) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => {
        return (
          <div>
            <NavBar user={user} />
            <Center type="center">
              <Construction size={32} />
              <p>There was an error! {error.message}</p>
              <Button onClick={() => resetErrorBoundary()} text="Try again" />
            </Center>
          </div>
        );
      }}
    >
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
};
