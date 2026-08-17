import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";

export default function LoginPage() {
  return (
    <div className="app-shell">
      <LoginForm />
      <p style={{ textAlign: "center", marginTop: 12 }}>
        Need an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}