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
      <div className="groups container">
        <Link to="/groups/new">
          <button>Start a new group</button>
        </Link>

        {groups.map((group) => {
          return (
            <Link
              className="groupInfo-link"
              key={group.id}
              to={`/groups/${group.id}`}
            >
              <div className="groups group-container">
                <div className="group img-container">
                  <img
                    className="group img"
                    src={group.previewImage}
                    alt={group.previewImage}
                  />
                </div>
                <div className="group details-container">
                  <div>
                    <h3 className="group name">{group.name}</h3>
                    <h4 className="group location">
                      {group.city}, {group.state}
                    </h4>
                  </div>
                  <p className="group about">{group.about}</p>
                  <p className="group numMembers">
                    {group.numMembers}{" "}
                    {group.numMembers === 1 ? "member" : "members"}{" "}
                    <span className="group interpunct">·</span>{" "}
                    <span className="group type_privacy">
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
