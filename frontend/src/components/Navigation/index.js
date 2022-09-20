import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import LoginSignupModal from "../LoginSignupModal";

const Navigation = () => {
  const activeSession = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link className="navlink" exact to="/">
            <i className="fa-solid fa-house fa-2x" />
          </Link>
        </li>
        <li className="login-signup-li">
          <Link to="/groups">Groups</Link>
          {!activeSession ? (
            <LoginSignupModal />
          ) : (
            <ProfileButton user={activeSession} />
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
