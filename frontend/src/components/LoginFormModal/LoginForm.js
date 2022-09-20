import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/session";
import "./LoginForm.css";

const LoginForm = ({ hidden, signup }) => {
  const dispatch = useDispatch();
  //   const activeSession = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const credentials = { email, password };

    setEmail("");
    setPassword("");

    try {
      await dispatch(login(credentials));
    } catch (err) {
      setWiggle(true);
      setErrors({ ...err });
    }
  };

  //   if (activeSession) return <Redirect to="/" />;

  return (
    <section className="login">
      <form className="login-form" onSubmit={submitHandler}>
        <div className="error">
          {errors.status && (
            <h3
              //   key={Math.random() * 100}
              onAnimationEnd={() => setWiggle(false)}
              className={wiggle ? "error-wiggle" : ""}
            >
              Login failed: {errors.message}
            </h3>
          )}
        </div>
        <label>Email</label>
        <input
          className="credentials"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          className="credentials"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="show-password">
          <div className="checkbox">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((state) => !state)}
            />
          </div>
          <span>Show Password</span>
        </label>
        <button type="submit">Log In</button>
        <p>
          Not a member yet? Sign up{" "}
          <span className="signup-span" onClick={signup}>
            here
          </span>
          !
        </p>
      </form>
    </section>
  );
};

export default LoginForm;
