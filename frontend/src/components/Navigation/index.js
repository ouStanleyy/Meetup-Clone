import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import LoginSignupModal from "../LoginSignupModal";

const Navigation = () => {
  const activeSession = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink className="navlink" exact to="/">
            <i className="fa-solid fa-house fa-2x" />
          </NavLink>
        </li>
        {!activeSession ? (
          <li>
            <LoginSignupModal />
          </li>
        ) : (
          <li>
            <ProfileButton user={activeSession} />
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
