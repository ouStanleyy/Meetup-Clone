import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getGroups } from "../../store/groups";
import "./Groups.css";

const GroupsIndex = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => Object.values(state.groups));

  useEffect(() => {
    (async () => dispatch(getGroups()))();
  }, [dispatch]);

  return (
    groups && (
      <div className="groups-container">
        {groups.map((group) => {
          return (
            <Link className="groupInfo-link" to={`/groups/${group.id}`}>
              <div key={group.id} className="data-container">
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
                    {group.numMembers === 1 ? "member" : "members"}
                  </p>
                  <p className="private">{group.private}</p>
                  <p className="type">{group.type}</p>
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
