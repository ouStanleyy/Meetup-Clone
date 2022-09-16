import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../store/session";
import "./LoginForm.css";

const LoginFormPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [wiggle, setWiggle] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const credentials = { email, password };

    setEmail("");
    setPassword("");

    try {
      await dispatch(login(credentials));

      history.push("/");
    } catch (err) {
      setErrors({ ...err });
    }
  };

  return (
    <section className="login">
      <form className="login-form" onSubmit={submitHandler}>
        <div className="errors">
          {errors.status && (
            <h3
              key={Math.random() * 100}
              onAnimationEnd={() => setWiggle(false)}
              className={wiggle ? "wiggle" : ""}
            >
              Login failed: {errors.message}
            </h3>
          )}
        </div>
        <label>Email</label>
        <input
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" onClick={() => setWiggle(true)}>
          Log In
        </button>
      </form>
    </section>
  );
};

export default LoginFormPage;
