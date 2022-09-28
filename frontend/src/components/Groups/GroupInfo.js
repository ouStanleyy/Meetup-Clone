import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import { Modal } from "../../context/Modal";
import {
  getGroupById,
  deleteGroup,
  getEventsOfGroup,
} from "../../store/groups";
import EventsIndex from "../Events/EventsIndex";
import { AddImageForm } from "../Images";
import EditGroupForm from "./EditGroupForm";
import "./Groups.css";

const GroupInfo = () => {
  const { groupId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups[groupId]);
  const organizer = useSelector(
    (state) => group?.organizerId === state.session.user?.id
  );
  const [showModal, setShowModal] = useState(false);
  const [showAddImg, setShowAddImg] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [bodyDisplay, setBodyDisplay] = useState("about");
  const [redirect, setRedirect] = useState(false);
  const [redirect2, setRedirect2] = useState(false);
  const [redirect3, setRedirect3] = useState(false);
  const [redirect4, setRedirect4] = useState(false);

  const deleteHandler = async () => {
    await dispatch(deleteGroup(group.id));
    history.push("/your-groups");
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getGroupById(groupId));
        await dispatch(getEventsOfGroup(groupId));
      } catch (err) {
        setRedirect(true);

        let redirectId = setTimeout(() => {
          setRedirect2(true);
          redirectId = setTimeout(() => {
            setRedirect3(true);
            redirectId = setTimeout(() => setRedirect4(true), 1000);
          }, 1000);
        }, 1000);

        const timeoutId = setTimeout(() => history.push("/groups"), 4000);

        return () => {
          clearTimeout(timeoutId);
          clearTimeout(redirectId);
        };
      }
    })();
  }, [dispatch, groupId, history]);

  if (redirect)
    return (
      <h1>
        The group that you are looking for does not exit. You will be redirected
        to the groups page in a moment.
        {redirect2 && (
          <p>
            {" "}
            Redirecting.{redirect3 && <span>.</span>}
            {redirect4 && <span>.</span>}
          </p>
        )}
      </h1>
    );

  return (
    group && (
      <div className="groupInfo container">
        <div className="groupInfo header">
          <div className="groupInfo img-container">
            <img
              className="groupInfo img"
              src={group.previewImage || group.Images?.[0]?.url}
              alt={group.previewImage || group.Images?.[0]?.url}
            />
          </div>
          <div className="groupInfo details-container">
            {!showEdit ? (
              <div className="groupInfo details-container-top">
                <h1 className="groupInfo name">{group.name}</h1>
                <div>
                  <p className="groupInfo location">
                    <i className="fa-solid fa-location-dot" />
                    {group.city}, {group.state}
                  </p>
                  <p className="groupInfo numMembers">
                    <i className="fa-solid fa-people-group" />
                    {group.numMembers}{" "}
                    {group.numMembers === 1 ? "member" : "members"}{" "}
                    <span className="interpunct">·</span>{" "}
                    <span className="groupInfo type_privacy">
                      {group.type} {group.private ? "private" : "public"} group
                    </span>
                  </p>
                  <p className="groupInfo organizer">
                    <i className="fa-solid fa-child-reaching" />
                    Organized by{" "}
                    <span className="groupInfo organizer-name">
                      {group.Organizer?.firstName} {group.Organizer?.lastName}
                    </span>
                  </p>
                </div>
                <div>
                  {organizer && (
                    <>
                      <button
                        className="groupInfo button"
                        onClick={() => setShowEdit(true)}
                      >
                        Edit
                      </button>
                      <button
                        className="groupInfo button"
                        onClick={() => setShowAddImg(true)}
                      >
                        Add Image
                      </button>
                      <button
                        className="groupInfo button"
                        onClick={() => setShowModal(true)}
                      >
                        Delete
                      </button>

                      {showModal && (
                        <Modal onClose={() => setShowModal(false)}>
                          <div style={{ backgroundColor: "white" }}>
                            <p>
                              Are you sure you want to delete this group? This
                              action is permanent and cannot be reverted.
                            </p>
                            <button onClick={deleteHandler}>DELETE</button>
                            <button onClick={() => setShowModal(false)}>
                              CANCEL
                            </button>
                          </div>
                        </Modal>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <EditGroupForm onUpdate={() => setShowEdit(false)} />
            )}

            {showAddImg && (
              <AddImageForm
                onClose={() => setShowAddImg(false)}
                addType="groups"
                id={groupId}
              />
            )}
          </div>
        </div>
        <nav className="groupInfo_navbar">
          <ul>
            <li>
              <span
                className={`groupInfo about-span ${
                  bodyDisplay === "about" ? "active" : ""
                }`}
                onClick={() => setBodyDisplay("about")}
              >
                About
              </span>{" "}
              <span
                className={`groupInfo events-span ${
                  bodyDisplay === "events" ? "active" : ""
                }`}
                onClick={() => setBodyDisplay("events")}
              >
                Events
              </span>
            </li>
            <li>
              {organizer && (
                <Link to={`/groups/${groupId}/events/new`}>
                  Start a new event
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <div className="groupInfo body">
          {bodyDisplay === "about" && (
            <div className="groupInfo about-container">
              <h3>What we're about</h3>
              <p className="groupInfo about">{group.about}</p>
            </div>
          )}
          {bodyDisplay === "events" && (
            <div className="groupInfo events-container">
              <EventsIndex />
            </div>
          )}
          <div className="groupInfo members-container">
            <h3>Organizer</h3>
            <p className="groupInfo organizer">
              <span className="groupInfo organizer-name">
                {group.Organizer?.firstName} {group.Organizer?.lastName}
              </span>
            </p>
            <h3>Members</h3>
          </div>
        </div>
      </div>
    )
  );
};

export default GroupInfo;
