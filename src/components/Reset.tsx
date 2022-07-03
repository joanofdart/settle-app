import "./Reset.css";
import { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../_config/env";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordReset } from "../_config/auth";

export default function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const resetPassword = useCallback(async () => {
    const res = await sendPasswordReset(email);
    alert(res.message);
  }, [email]);

  useEffect(() => {
    if (loading) return;

    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);

  return (
    <div className="reset">
      <div className="reset__container">
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <button className="reset__btn" onClick={() => resetPassword()}>
          Send password reset email
        </button>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
