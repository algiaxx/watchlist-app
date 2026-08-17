import { Link } from "react-router-dom";
import SignupForm from "../components/SignupForm.jsx";

export default function SignupPage() {
  return (
    <div className="app-shell">
      <SignupForm />
      <p style={{ textAlign: "center", marginTop: 12 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}