import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getGroups } from "../../store/groups";
import { getSessionGroups } from "../../store/session";
import "./Groups.css";

const GroupsIndex = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const groups = useSelector((state) =>
    Object.values(pathname === "/groups" ? state.groups : state.session.groups)
  );

  useEffect(() => {
    pathname === "/groups"
      ? (async () => dispatch(getGroups()))()
      : (async () => dispatch(getSessionGroups()))();
  }, [dispatch, pathname]);

  return (
    groups && (
      <div className="groups-container">
        {groups.map((group) => {
          return (
            <Link
              className="groupInfo-link"
              key={group.id}
              to={`/groups/${group.id}`}
            >
              <div className="data-container">
                <div className="img-container">
                  <img
                    className="img"
                    src={group.previewImage}
                    alt={group.previewImage}
                  />
                </div>
                <div className="details-container">
                  <h3 className="name">{group.name}</h3>
                  <h4 className="group">
                    {group.city}, {group.state}
                  </h4>
                  <p className="about">{group.about}</p>
                  <p className="numMembers">
                    {group.numMembers}{" "}
                    {group.numMembers === 1 ? "member" : "members"}{" "}
                    <span className="interpunct">·</span>{" "}
                    <span className="type_private">
                      {group.type} {group.private ? "private" : "public"} group
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    )
  );
};

export default GroupsIndex;
