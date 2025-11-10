import { CONSTANTS } from "@/constants/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export function withAuthGuard<P extends {}>(Component: React.ComponentType<P>) {
  const WrappedComponent: React.FC<P> = (props) => {
    const token = cookies().get(CONSTANTS.COOKIE_KEYS.AUTH_TOKEN)?.value;
    if (token) {
      redirect(CONSTANTS.ROUTES.HOME);
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `WithAuthGuard(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
}
