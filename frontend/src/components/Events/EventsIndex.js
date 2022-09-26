import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getEvents } from "../../store/events";
import { getSessionEvents } from "../../store/session";
import "./Events.css";

const EventsIndex = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const events = useSelector((state) =>
    Object.values(pathname === "/events" ? state.events : state.session.events)
  );
  const eventsRef = useRef([]);
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
      { threshold: 0.5 }
    );

    (async () => {
      try {
        await dispatch(getEvents());

        eventsRef.current.forEach((el) => {
          observer.observe(el);
        });
      } catch (err) {}
    })();
  }, [dispatch, pathname]);

  return (
    events && (
      <div className="events container">
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
                    src={event.previewImage}
                    alt={event.previewImage}
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
                    <h3 className="event name">{event.name}</h3>
                  </div>
                  <p className="event group-name">
                    {event.Group.name}{" "}
                    <span className="event interpunct">·</span>{" "}
                    <span className="event group-location">
                      {event.Group.city}, {event.Group.state}
                    </span>
                  </p>
                  <p className="event numAttending">
                    {event.numAttending}{" "}
                    {event.numAttending === 1 ? "attendee" : "attendees"}{" "}
                    <span className="event interpunct">·</span>{" "}
                    <span className="event type_privacy">
                      {event.type} {event.private ? "private" : "public"} event
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

export default EventsIndex;