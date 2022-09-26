import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logout } from "../../store/session";

const ProfileButton = ({ user }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    history.push("/");
  };

  useEffect(() => {
    const closeMenu = () => setShowMenu(false);

    if (showMenu) document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  return (
    <>
      <button
        className="profile-button"
        onClick={() => setShowMenu((state) => !state)}
      >
        <i className="fa-regular fa-user fa-2x" />
      </button>
      {showMenu && (
        <div className="dropdown-menu">
          <div>
            {user.firstName} {user.lastName}
          </div>
          <div>{user.email}</div>
          <div>
            <Link to="/your-groups">Your groups</Link>
          </div>
          <div>
            <Link to="/your-events">Your events</Link>
          </div>
          <div>
            <Link to="/groups/new">Start a new group</Link>
          </div>
          <div>
            <button className="logout-button" onClick={logoutHandler}>
              <i className="fa-solid fa-right-from-bracket fa-2x" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileButton;
