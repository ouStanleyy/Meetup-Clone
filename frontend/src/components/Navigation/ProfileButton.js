import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
        <ul className="dropdown-menu">
          <li>
            {user.firstName} {user.lastName}
          </li>
          <li>{user.email}</li>
          <li>
            <button
              className="logout-button"
              onClick={() => dispatch(logout())}
            >
              <i className="fa-solid fa-right-from-bracket fa-2x" />
            </button>
          </li>
        </ul>
      )}
    </>
  );
};

export default ProfileButton;
