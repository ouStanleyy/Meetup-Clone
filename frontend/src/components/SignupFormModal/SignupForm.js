import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { signup } from "../../store/session";
import "./SignupForm.css";

const SignupForm = ({ login }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  // const activeSession = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitReady, setSubmitReady] = useState(false);
  const [errors, setErrors] = useState({});
  const [wiggle, setWiggle] = useState(false);

  const hasInvalidChars = (str) => {
    const invalidChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return invalidChars.test(str);
  };

  const isValidEmail = (str) => {
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi;
    return validEmail.test(str);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword)
      return setErrors({ status: 400, message: "Passwords do not match" });

    const credentials = { firstName, lastName, email, password };

    try {
      await dispatch(signup(credentials));
      history.push("/groups/new");
    } catch (err) {
      setWiggle(true);
      setErrors({ ...err, ...err.errors });
    }
  };

  useEffect(() => {
    setSubmitReady(false);

    firstName.length > 0 &&
      !hasInvalidChars(firstName) &&
      lastName.length > 0 &&
      !hasInvalidChars(lastName) &&
      isValidEmail(email) &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword &&
      setSubmitReady(true);
  }, [firstName, lastName, email, password, confirmPassword]);

  // if (activeSession) return <Redirect to="/" />;

  return (
    <section className="signup">
      <form className="signup-form" onSubmit={submitHandler}>
        <h1>Sign up</h1>
        <div className="errors">
          {errors.status && (
            <h3
              onAnimationEnd={() => setWiggle(false)}
              className={wiggle ? "errors-wiggle" : ""}
            >
              Signup failed: {errors.message}
            </h3>
          )}
        </div>
        <label>First Name</label>
        <input
          className={`credentials ${errors.firstName && "err"}`}
          type="text"
          placeholder="First Name"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <span className="confirmation-check">
          {firstName.length > 0 && !hasInvalidChars(firstName) && (
            <i className="fa-solid fa-check" />
          )}
        </span>
        <p>{errors.firstName}</p>
        <label>Last Name</label>
        <input
          className={`credentials ${errors.lastName && "err"}`}
          type="text"
          placeholder="Last Name"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <span className="confirmation-check">
          {lastName.length > 0 && !hasInvalidChars(lastName) && (
            <i className="fa-solid fa-check" />
          )}
        </span>
        <p>{errors.lastName}</p>
        <label>Email</label>
        <input
          className={`credentials ${errors.email && "err"}`}
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="confirmation-check">
          {isValidEmail(email) && <i className="fa-solid fa-check" />}
        </span>
        <p>{errors.email}</p>
        <label>Password</label>
        <input
          className={`credentials ${errors.password && "err"}`}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="confirmation-check">
          {password.length >= 6 && <i className="fa-solid fa-check" />}
        </span>
        <p>{errors.password}</p>
        <label>Confirm Password</label>
        <input
          className={`credentials ${errors.password && "err"}`}
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span className="confirmation-check">
          {confirmPassword.length >= 6 && password === confirmPassword && (
            <i className="fa-solid fa-check" />
          )}
        </span>
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
        <button disabled={!submitReady} type="submit">
          Sign Up
        </button>
        <p>
          Already a member?{" "}
          <span className="login-span" onClick={login}>
            Log in
          </span>
        </p>
      </form>
    </section>
  );
};

export default SignupForm;
