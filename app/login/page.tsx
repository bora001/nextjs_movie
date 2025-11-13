import { withAuthGuard } from "@/component/hoc/withAuthGuard";
import { LoginForm } from "./LoginForm";

function LoginPage() {
  return <LoginForm />;
}

export default withAuthGuard(LoginPage);
