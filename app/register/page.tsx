import RegisterForm from "./RegisterForm";

import { withAuthGuard } from "@/component/hoc/withAuthGuard";

function RegisterPage() {
  return <RegisterForm />;
}

export default withAuthGuard(RegisterPage);
