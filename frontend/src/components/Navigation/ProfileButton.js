import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../store/session";

const ProfileButton = ({ user }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

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
            <button
              className="logout-button"
              onClick={() => dispatch(logout())}
            >
              <i className="fa-solid fa-right-from-bracket fa-2x" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileButton;
