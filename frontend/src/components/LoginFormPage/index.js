import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../store/session";

const LoginFormPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

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
        {errors.status && <h3>Login failed: {errors.message}</h3>}
        <label>
          Email
          <input
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Log In</button>
      </form>
    </section>
  );
};

export default LoginFormPage;
