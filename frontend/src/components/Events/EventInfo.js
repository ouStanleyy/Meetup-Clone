import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import { Modal } from "../../context/Modal";
import { getEventById, deleteEvent } from "../../store/events";
import { getGroupById } from "../../store/groups";
import { AddImageForm } from "../Images";
// import EditEventForm from "./EditEventForm";
import "./Events.css";

const EventInfo = () => {
  const { eventId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const event = useSelector((state) => state.events[eventId]);
  const group = useSelector((state) => state.groups[event?.groupId]);
  const organizer = useSelector(
    (state) => event?.organizerId === state.session.user?.id
  );
  const [showModal, setShowModal] = useState(false);
  const [showAddImg, setShowAddImg] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirect2, setRedirect2] = useState(false);
  const [redirect3, setRedirect3] = useState(false);
  const [redirect4, setRedirect4] = useState(false);

  const deleteHandler = async () => {
    await dispatch(deleteEvent(event.id));
    history.push("/your-events");
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getEventById(eventId));
      } catch (err) {
        setRedirect(true);

        let redirectId = setTimeout(() => {
          setRedirect2(true);
          redirectId = setTimeout(() => {
            setRedirect3(true);
            redirectId = setTimeout(() => setRedirect4(true), 1000);
          }, 1000);
        }, 1000);

        const timeoutId = setTimeout(() => history.push("/events"), 4000);

        return () => {
          clearTimeout(timeoutId);
          clearTimeout(redirectId);
        };
      }
    })();
  }, [dispatch, eventId, history]);

  useEffect(() => {
    (async () => await dispatch(getGroupById(event?.groupId)))();
  }, [dispatch, event]);

  if (redirect)
    return (
      <h1>
        The event that you are looking for does not exit. You will be redirected
        to the events page in a moment.
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
    event &&
    group && (
      <div className="eventInfo container">
        <div className="eventInfo header">
          <h4 className="eventInfo startDate">
            {new Date(event.startDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h4>
          <h1 className="eventInfo name">{event.name}</h1>
          <p className="eventInfo organizer">
            <i className="fa-solid fa-child-reaching" />
            Hosted by{" "}
            <span className="eventInfo organizer-name">
              {group?.Organizer?.firstName} {group?.Organizer?.lastName}
            </span>
          </p>
        </div>
        <div className="eventInfo body">
          <div className="eventInfo body-left">
            <div className="eventInfo img-container">
              <img
                className="eventInfo img"
                src={event.previewImage || event.Images?.[0]?.url}
                alt={event.previewImage || event.Images?.[0]?.url}
              />
            </div>
            <div className="eventInfo description-container">
              <h3>Details</h3>
              <p className="eventpInfo description">{event.description}</p>
            </div>
            <div className="eventInfo attendees-container">
              <h3>Attendees</h3>
            </div>
            {/* <div className="eventInfo details-container">
              {!showEdit ? (
                <div className="eventInfo details-container-top">
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
                                Are you sure you want to delete this event? This
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
                // <EditGroupForm onUpdate={() => setShowEdit(false)} />
                <></>
              )}

              {showAddImg && (
                <AddImageForm onClose={() => setShowAddImg(false)} />
              )}
            </div> */}
          </div>

          <div className="eventInfo body-right">
            <Link to={`/groups/${group.id}`}>
              <div className="eventInfo group">
                <div className="eventInfo group_img-container">
                  <img
                    className="eventInfo group_img"
                    src={group?.previewImage || group?.Images?.[0]?.url}
                    alt={group?.previewImage || group?.Images?.[0]?.url}
                  />
                </div>
                <div className="eventInfo group_details">
                  <h4>{group?.name}</h4>
                  <p>
                    {group?.type} {group.private ? "private" : "public"} group
                  </p>
                </div>
              </div>
            </Link>
            <div className="eventInfo venue">
              <div className="eventInfo venue-date">
                <i className="fa-regular fa-clock" />
                <p>
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(event.startDate).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}{" "}
                  to{" "}
                  {new Date(event.endDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(event.endDate).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    timeZoneName: "short",
                  })}{" "}
                </p>
              </div>
              <div className="eventInfo venue-location">
                <i className="fa-solid fa-map-pin" />
                {event.Venue ? (
                  <p>
                    {event.Venue?.address}{" "}
                    <span className="event interpunct">·</span>{" "}
                    {event.Venue?.city}, {event.Venue?.state}
                  </p>
                ) : (
                  <p>Venue location has not been provided yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default EventInfo;
