import RegisterForm from "./registerForm";

import { withAuthGuard } from "@/component/hoc/withAuthGuard";

function RegisterPage() {
  return <RegisterForm />;
}

export default withAuthGuard(RegisterPage);
