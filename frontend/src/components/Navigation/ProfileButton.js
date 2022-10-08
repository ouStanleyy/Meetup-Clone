import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logout } from "../../store/session";

const ProfileButton = ({ user }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [closeMenu, setCloseMenu] = useState(false);
  const [pausedFn, setPausedFn] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    history.push("/");
  };

  const openMenu = () => {
    if (!pausedFn) {
      setPausedFn(true);
      setShowMenu(true);
      setTimeout(() => setPausedFn(false), 200);
    }
  };

  useEffect(() => {
    const closeMenu = () => {
      setCloseMenu(true);
      setTimeout(() => {
        setShowMenu(false);
        setTimeout(() => setCloseMenu(false), 10);
      }, 200);
    };

    if (showMenu && !pausedFn) document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu, pausedFn]);

  return (
    <>
      <button className="profile-button" onClick={openMenu}>
        <i className="fa-regular fa-user fa-2x" />
      </button>
      {showMenu && (
        <div className={`dropdown-menu ${closeMenu && "closed"}`}>
          <div>
            {user.firstName} {user.lastName}
          </div>
          <div>{user.email}</div>
          <div>
            <Link to="/your-groups">Your groups</Link>
          </div>
          {/* <div>
            <Link to="/your-events">Your events</Link>
          </div> */}
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
