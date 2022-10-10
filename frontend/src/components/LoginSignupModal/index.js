import { useState, useEffect, useRef } from "react";
import { Modal } from "../../context/Modal";
import LoginForm from "../LoginFormModal/LoginForm";
import SignupForm from "../SignupFormModal/SignupForm";
import "./LoginSignupModal.css";

const LoginSignupModal = ({ area }) => {
  const [showModal, setShowModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [toggleDisplay, setToggleDisplay] = useState("");
  const [height, setHeight] = useState("");
  const [exitAnimation, setExitAnimation] = useState(false);
  const loginRef = useRef(null);
  const signupRef = useRef(null);

  useEffect(() => {
    if (showLogin) setHeight(loginRef.current.clientHeight);
  }, [showLogin]);

  useEffect(() => {
    if (showSignup) setHeight(signupRef.current.clientHeight);
  }, [showSignup]);

  const login = () => {
    setShowModal(true);
    setToggleDisplay(true);
    setShowLogin(true);
    setTimeout(() => setShowSignup(false), 500);
  };

  const signup = () => {
    setShowModal(true);
    setToggleDisplay(false);
    setShowSignup(true);
    setTimeout(() => setShowLogin(false), 500);
  };

  const reset = () => {
    setExitAnimation(true);
    setTimeout(() => {
      setHeight("");
      setToggleDisplay("");
      setShowModal(false);
      setShowLogin(false);
      setShowSignup(false);
      setExitAnimation(false);
    }, 300);
  };

  return (
    <>
      {area === "nav" && (
        <>
          <button className="login-button" onClick={login}>
            Log In
          </button>
          <button className="signup-button" onClick={signup}>
            Sign Up
          </button>
        </>
      )}
      {area === "join" && (
        <button className="join-meetup" onClick={signup}>
          Join RendeVue
        </button>
      )}
      {area === "start" && <h3 onClick={signup}>Start a group</h3>}
      {showModal && (
        <Modal onClose={reset}>
          <div
            className={
              exitAnimation
                ? "login_signup-modal exit-animation"
                : "login_signup-modal"
            }
            style={{ height }}
          >
            <div
              ref={loginRef}
              className={toggleDisplay ? "login-modal" : "login-modal_hidden"}
            >
              {showLogin && <LoginForm signup={signup} />}
            </div>
            <div
              ref={signupRef}
              className={
                !toggleDisplay ? "signup-modal" : "signup-modal_hidden"
              }
            >
              {showSignup && <SignupForm login={login} />}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default LoginSignupModal;
