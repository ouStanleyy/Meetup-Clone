import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getGroupById } from "../../store/groups";
import "./Groups.css";

const GroupInfo = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups[groupId]);
  const organizer = useSelector(
    (state) => group?.organizerId === state.session.user.id
  );

  useEffect(() => {
    (async () => dispatch(getGroupById(groupId)))();
  }, [dispatch, groupId]);

  return (
    group && (
      <div key={group.id} className="groupInfo-container">
        <div className="groupInfo-header">
          <div className="img-container">
            <img
              className="img"
              src={group.previewImage}
              alt={group.previewImage}
            />
          </div>
          <div className="groupInfo-details">
            <h3 className="name">{group.name}</h3>
            <h4 className="group">
              {group.city}, {group.state}
            </h4>
            <p className="numMembers">
              {group.numMembers} {group.numMembers === 1 ? "member" : "members"}{" "}
              <span className="interpunct">·</span>{" "}
              <span className="type_private">
                {group.type} {group.private ? "private" : "public"} group
              </span>
            </p>
            {organizer && (
              <>
                <button>
                  <Link to={`/groups/${group.id}/edit`}>Edit</Link>
                </button>
                <button>
                  <Link to={`/groups/${group.id}/images/add`}>Add Image</Link>
                </button>
              </>
            )}
          </div>
        </div>
        <h3>What we're about</h3>
        <p className="about">{group.about}</p>
      </div>
    )
  );
};

export default GroupInfo;
