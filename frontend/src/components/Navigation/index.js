import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

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
          <>
            <li>
              <NavLink className="navlink" to="/login">
                Log In
              </NavLink>
            </li>
            <li>
              <NavLink className="navlink" to="/signup">
                Sign Up
              </NavLink>
            </li>
          </>
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
