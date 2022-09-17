import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../../store/session";
import ProfileButton from "./ProfileButton";

const Navigation = () => {
  const dispatch = useDispatch();
  const activeSession = useSelector((state) => state.session.user);

  return (
    <nav>
      <ul>
        <li>
          <NavLink exact to="/">
            Home
          </NavLink>
        </li>
        {!activeSession ? (
          <>
            <li>
              <NavLink to="/login">Log In</NavLink>
            </li>
            <li>
              <NavLink to="/signup">Sign Up</NavLink>
            </li>
          </>
        ) : (
          <li>
            <ProfileButton />
            <NavLink onClick={() => dispatch(logout())} to="/">
              Log Out
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
