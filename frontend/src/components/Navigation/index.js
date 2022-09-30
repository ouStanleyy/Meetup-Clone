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
          <Link className="navlink" to="/">
            {/* <i className="fa-solid fa-house fa-2x" /> */}
            <span id="home-logo">RendeVue</span>
          </Link>
        </li>
        <li className="login-signup-li">
          <Link to="/groups">Groups</Link>
          <Link to="/events">Events</Link>
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
