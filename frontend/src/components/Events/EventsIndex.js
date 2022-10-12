import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { getEvents } from "../../store/events";
import Loader from "../Loader";
import "./Events.css";

const EventsIndex = () => {
  const { pathname } = useLocation();
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const events = useSelector((state) =>
    Object.values(
      pathname === "/events" ? state.events : state.groups[groupId].Events
    )
  );
  const eventsRef = useRef([]);
  const eventsContainerRef = useRef();
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) =>
          setIsVisible((state) => ({
            ...state,
            [entry.target]: entry.isIntersecting,
          }))
        ),
      { threshold: 0.5, root: eventsContainerRef.current }
    );

    (async () => {
      try {
        await dispatch(getEvents());

        if (pathname === "/events")
          eventsRef.current.forEach((el) => {
            observer.observe(el);
          });
      } catch (err) {}
    })();
  }, [dispatch, pathname]);

  return events ? (
    <div ref={eventsContainerRef} className="events container">
      {events.map((event, idx) => {
        return (
          <Link
            className="eventInfo-link"
            key={event.id}
            ref={(el) => (eventsRef.current[idx] = el)}
            to={`/events/${event.id}`}
          >
            <div
              className={`events event-container ${
                isVisible[eventsRef.current[idx]?.href] ? "visible" : ""
              }`}
            >
              <div className="event img-container">
                <img
                  className="event img"
                  src={
                    event.previewImage ||
                    "https://st.depositphotos.com/3097111/4720/v/450/depositphotos_47208689-stock-illustration-picture-coming-soon-image-vector.jpg"
                  }
                  alt={
                    event.previewImage ||
                    "https://st.depositphotos.com/3097111/4720/v/450/depositphotos_47208689-stock-illustration-picture-coming-soon-image-vector.jpg"
                  }
                />
              </div>
              <div className="event details-container">
                <div>
                  <h4 className="event startDate">
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    ·{" "}
                    {new Date(event.startDate).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      timeZoneName: "short",
                    })}
                  </h4>
                  <h3 className="event name">
                    {pathname === "/events"
                      ? event.name
                      : `${event.name.slice(0, 24)}...`}
                  </h3>
                </div>
                <p className="event group-name">
                  {event.Group.name} <span className="event interpunct">·</span>{" "}
                  <span className="event group-location">
                    {event.Group.city}, {event.Group.state}
                  </span>
                </p>
                <p className="event numAttending">
                  {event.numAttending}{" "}
                  {event.numAttending === 1 ? "attendee" : "attendees"}{" "}
                  <span className="event interpunct">·</span>{" "}
                  <span className="event type_privacy">{event.type} event</span>
                </p>
              </div>
            </div>
          </Link>
        );
      })}
      {pathname === "/events" && <div className="event discover"></div>}
    </div>
  ) : (
    <Loader />
  );
};

export default EventsIndex;
