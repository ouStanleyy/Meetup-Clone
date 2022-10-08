import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import { Modal } from "../../context/Modal";
import {
  getGroupById,
  deleteGroup,
  getEventsOfGroup,
  getMembersOfGroup,
  requestMembership,
} from "../../store/groups";
import EventsIndex from "../Events/EventsIndex";
import MembersIndex from "../Members/MembersIndex";
import VenuesIndex from "../Venues/VenuesIndex";
import { AddImageForm } from "../Images";
import EditGroupForm from "./EditGroupForm";
import CreateVenueForm from "../Venues/CreateVenueForm";
import "./Groups.css";

const GroupInfo = () => {
  const { groupId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups[groupId]);
  const organizer = useSelector(
    (state) => group?.organizerId === state.session.user?.id
  );
  const members = group?.Members && Object.values(group.Members);
  // const members =
  //   group?.Members &&
  //   (organizer
  //     ? Object.values(group.Members)
  //     : Object.values(group.Members).filter(
  //         (member) => member.Membership.status !== "pending"
  //       ));
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAddImg, setShowAddImg] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [bodyDisplay, setBodyDisplay] = useState("about");
  const [toggleDisplay, setToggleDisplay] = useState(true);
  const [toggleRightDisplay, setToggleRightDisplay] = useState(true);
  const [pausedFn, setPausedFn] = useState(false);
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirect2, setRedirect2] = useState(false);
  const [redirect3, setRedirect3] = useState(false);
  const [redirect4, setRedirect4] = useState(false);
  const [transform, setTransform] = useState("");

  const deleteHandler = async () => {
    await dispatch(deleteGroup(group.id));
    history.push("/your-groups");
  };

  const mouseMoveHandler = (e) => {
    const width = e.currentTarget.offsetWidth;
    const height = e.currentTarget.offsetHeight;
    const centerX = e.currentTarget.offsetLeft + width / 2;
    const centerY = e.currentTarget.offsetTop + height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = (-mouseY / (height / 2)).toFixed(2);
    const rotateY = (mouseX / (width / 2)).toFixed(2);

    setTransform(
      `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    );
  };

  const selectBodyDisplay = (selection) => {
    if (!pausedFn) {
      setPausedFn(true);
      setToggleDisplay(false);
      setTimeout(() => {
        setBodyDisplay(selection);
        setTimeout(() => {
          setToggleDisplay(true);
          setTimeout(() => setPausedFn(false), 450);
        }, 300);
      }, 300);
    }
  };

  const selectRightDisplay = (selection) => (e) => {
    if (!pausedFn) {
      setPausedFn(true);
      setToggleRightDisplay(selection);
      setTimeout(() => {
        setShowAddVenue(!selection);
        // setTimeout(() => {
        // setToggleRightDisplay(true);
        setTimeout(() => setPausedFn(false), 450);
        // }, 300);
      }, 150);
    }

    e.preventDefault();
  };

  const joinGroup = async () => {
    try {
      await dispatch(requestMembership(groupId));
      setShowRequestModal(true);
    } catch (err) {
      setShowErrorModal(true);
      setErrors({ ...err });
    }
  };

  const closeDeleteModal = () => {
    setExitAnimation(true);
    setTimeout(() => {
      setShowModal(false);
      setShowRequestModal(false);
      setShowErrorModal(false);
      setExitAnimation(false);
    }, 300);
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getGroupById(groupId));
        await dispatch(getEventsOfGroup(groupId));
        await dispatch(getMembersOfGroup(groupId));
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

  return redirect ? (
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
  ) : (
    group && (
      <div
        className="groupInfo container"
        onMouseMove={mouseMoveHandler}
        onMouseLeave={() => setTransform("")}
        style={{ transform }}
      >
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
                        <Modal onClose={closeDeleteModal}>
                          <div
                            className={`delete-modal ${
                              exitAnimation && "exit-animation"
                            }`}
                          >
                            <p>
                              Are you sure you want to delete this group? This
                              action is permanent and cannot be reverted.
                            </p>
                            <button onClick={deleteHandler}>DELETE</button>
                            <button onClick={closeDeleteModal}>CANCEL</button>
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
              <div className="add-img">
                <AddImageForm
                  onClose={() => setShowAddImg(false)}
                  addType="groups"
                  id={groupId}
                />
              </div>
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
                onClick={() => selectBodyDisplay("about")}
              >
                About
              </span>
              <span
                className={`groupInfo events-span ${
                  bodyDisplay === "events" ? "active" : ""
                }`}
                onClick={() => selectBodyDisplay("events")}
              >
                Events
              </span>
              <span
                className={`groupInfo members-span ${
                  bodyDisplay === "members" ? "active" : ""
                }`}
                onClick={() => selectBodyDisplay("members")}
              >
                Members
              </span>
              <span
                className={`groupInfo venues-span ${
                  bodyDisplay === "venues" ? "active" : ""
                }`}
                onClick={() => selectBodyDisplay("venues")}
              >
                Venues
              </span>
            </li>
            <li>
              {organizer ? (
                <>
                  <span
                    className={`groupInfo new-venue-span ${
                      showAddVenue ? "active" : ""
                    }`}
                    onClick={selectRightDisplay(false)}
                  >
                    Add a venue
                  </span>
                  <Link
                    className="groupInfo new-event"
                    to={`/groups/${groupId}/events/new`}
                  >
                    Start a new event
                  </Link>
                </>
              ) : (
                <button className="groupInfo button" onClick={joinGroup}>
                  Join this group
                </button>
              )}
            </li>
          </ul>
        </nav>

        <div className="groupInfo body">
          {bodyDisplay === "about" && (
            <div
              className={`groupInfo about-container ${
                toggleDisplay ? "" : "hidden"
              }`}
            >
              <h3>What we're about</h3>
              <p className="groupInfo about">{group.about}</p>
            </div>
          )}
          {bodyDisplay === "events" && (
            <div
              className={`groupInfo events-container ${
                toggleDisplay ? "" : "hidden"
              }`}
            >
              <EventsIndex />
            </div>
          )}
          {bodyDisplay === "members" && (
            <div
              className={`groupInfo all-members-container ${
                toggleDisplay ? "" : "hidden"
              }`}
            >
              <MembersIndex members={members} organizer={organizer} />
            </div>
          )}
          {bodyDisplay === "venues" && (
            <div
              className={`groupInfo venues-container ${
                toggleDisplay ? "" : "hidden"
              }`}
            >
              <VenuesIndex organizer={organizer} />
            </div>
          )}

          <div
            className={`groupInfo body-right ${
              toggleRightDisplay ? "" : "hidden"
            }`}
          >
            {showAddVenue ? (
              <div className="groupInfo new-venue-container">
                <CreateVenueForm onClose={selectRightDisplay(true)} />
              </div>
            ) : (
              <div className="groupInfo members-container">
                <h3>Organizer</h3>
                <p className="groupInfo organizer">
                  <span className="groupInfo organizer-name">
                    {group.Organizer?.firstName} {group.Organizer?.lastName}
                  </span>
                </p>
                <h3>Members ({group.numMembers})</h3>
                {members &&
                  members.map((member) => (
                    <p key={member.id} className="groupInfo member">
                      {member.firstName} {member.lastName}
                    </p>
                  ))}
              </div>
            )}
          </div>
        </div>

        {showRequestModal && (
          <Modal onClose={closeDeleteModal}>
            <div
              className={`delete-modal ${exitAnimation && "exit-animation"}`}
            >
              <p>You have requested to join this group.</p>
              <button onClick={closeDeleteModal}>Okay</button>
            </div>
          </Modal>
        )}

        {showErrorModal && (
          <Modal onClose={closeDeleteModal}>
            <div
              className={`delete-modal ${exitAnimation && "exit-animation"}`}
            >
              <p>{errors.message}.</p>
              <button onClick={closeDeleteModal}>Okay</button>
            </div>
          </Modal>
        )}
      </div>
    )
  );
};

export default GroupInfo;
