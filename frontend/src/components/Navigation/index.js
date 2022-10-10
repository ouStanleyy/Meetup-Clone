import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import LoginSignupModal from "../LoginSignupModal";

const Navigation = () => {
  const { pathname } = useLocation();
  const activeSession = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">
            {/* <i className="fa-solid fa-house fa-2x" /> */}
            <span id="home-logo">RendeVue</span>
          </Link>
        </li>
        <li className="login-signup-li">
          <Link className={pathname === "/groups" ? "active" : ""} to="/groups">
            Groups
          </Link>
          <Link className={pathname === "/events" ? "active" : ""} to="/events">
            Events
          </Link>
        </li>
        <li className="about-me-links">
          <a href="https://github.com/ouStanleyy">
            <i class="fa-brands fa-github-alt fa-2x" />
          </a>
          <a href="https://www.linkedin.com/in/stanley-ou/">
            <i class="fa-brands fa-linkedin-in fa-2x" />
          </a>
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
