import { useState } from "react";
import { Modal } from "../../context/Modal";
import LoginForm from "../LoginFormModal/LoginForm";
import SignupForm from "../SignupFormModal/SignupForm";
import "./LoginSignupModal.css";

const LoginSignupModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [menu, setMenu] = useState("");
  const [toggleDisplay, setToggleDisplay] = useState("");
  const [height, setHeight] = useState("");

  const login = () => {
    // setShowSignup(false);
    setShowLogin(true);
    setToggleDisplay(true);
    setShowModal(true);
    setHeight("300px");
  };

  const signup = () => {
    // setShowLogin(false);
    setShowSignup(true);
    setToggleDisplay(false);
    setShowModal(true);
    setHeight("650px");
  };

  const setSignup = () => {
    setToggleDisplay(false);
    setTimeout(() => setShowLogin(false), 500);
    setHeight("650px");
    setShowSignup(true);
  };

  const setLogin = () => {
    setToggleDisplay(true);
    setTimeout(() => setShowSignup(false), 500);
    setHeight("300px");
    setShowLogin(true);
  };

  //   const toggleMenu = (menu) => {
  //     setMenu(menu);
  //     setShowModal(true);
  //   };

  const closeModal = () => {
    setShowModal(false);
    setShowLogin(false);
    setShowSignup(false);
    setToggleDisplay("");
    setHeight("");
  };

  return (
    <>
      <button className="login-button" onClick={login}>
        Log In
      </button>
      <button className="signin-button" onClick={signup}>
        Sign Up
      </button>
      {showModal && (
        <Modal onClose={closeModal}>
          <div className="login_signup-modal" style={{ height: height }}>
            <div
              className={toggleDisplay ? "login-modal" : "login-modal_hidden"}
            >
              {showLogin && <LoginForm signup={setSignup} />}
            </div>
            <div
              className={
                !toggleDisplay ? "signup-modal" : "signup-modal_hidden"
              }
            >
              {showSignup && <SignupForm login={setLogin} />}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default LoginSignupModal;
