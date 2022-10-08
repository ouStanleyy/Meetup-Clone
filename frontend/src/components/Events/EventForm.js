import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { createEvent, editEvent, getEventById } from "../../store/events";
import { getGroupById } from "../../store/groups";

const EventForm = ({ closeForm, event, formType }) => {
  const { groupId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const venues = useSelector(
    (state) => state.groups[groupId || event?.groupId]?.Venues
  );
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description);
  const [type, setType] = useState(event.type);
  const [capacity, setCapacity] = useState(event.capacity);
  const [price, setPrice] = useState(`$${Number(event.price).toFixed(2)}`);
  const [startDate, setStartDate] = useState(event.startDate);
  const [endDate, setEndDate] = useState(event.endDate);
  const [venueId, setVenueId] = useState(
    event.venueId ? event.venueId : "null"
  );
  const [errors, setErrors] = useState({});
  const [wiggle, setWiggle] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirect2, setRedirect2] = useState(false);
  const [redirect3, setRedirect3] = useState(false);
  const [redirect4, setRedirect4] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    event = {
      ...event,
      name,
      description,
      type,
      capacity: Number(capacity),
      price: Number(price.slice(1)),
      startDate,
      endDate,
      venueId: venueId > 0 ? Number(venueId) : null,
    };

    try {
      const newEvent = await dispatch(
        formType === "Create" ? createEvent(groupId, event) : editEvent(event)
      );
      await dispatch(getEventById(newEvent.id));

      formType === "Update"
        ? closeForm()
        : history.push(`/events/${newEvent.id}`);
    } catch (err) {
      setWiggle(true);
      setErrors({ ...err, ...err.errors });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (groupId) await dispatch(getGroupById(groupId));
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

  useEffect(() => {
    0 < name.length && name.length < 5
      ? setErrors({ name: "Name must be at least 5 characters" })
      : setErrors({});
  }, [name]);

  const capacityHandler = ({ target: { value } }) => {
    if (value < 0 || value.length < 1) setCapacity(0);
    else if (value.length > 1 && value.startsWith(0))
      setCapacity(value.slice(1));
    else setCapacity(value);
  };

  const priceHandler = ({ target: { value } }) => {
    if (value.length < 1) setPrice("$0.00");
    else {
      value = value.replace(/[$.,]/g, "");
      const valueDisplay = (parseInt(value, 10) / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      setPrice(valueDisplay);
    }
  };

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

  // const endDateHandler = ({ target: { value } }) => {
  //   // if ((value - startDate) < 30)
  // };

  return (
    <section className="eventForm-section">
      <form className="event-form" onSubmit={submitHandler}>
        {/* <div className="errors">
          {errors.status && (
            <h3
              onAnimationEnd={() => setWiggle(false)}
              className={wiggle ? "errors-wiggle" : ""}
            >
              Event creation failed: {errors.message}
            </h3>
          )}
        </div> */}
        <div className="event_name-container">
          <label>Event Name:</label>
          <input
            className="event-info"
            type="text"
            placeholder="Minimum of 5 characters"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {/* <p>{errors.name}</p> */}
        </div>
        <div className="description-container">
          <label>Description:</label>
          <textarea
            className="event-info"
            placeholder="Details of your event"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* <p>{errors.description}</p> */}
        </div>
        <div className="capacity_price-container">
          <div>
            <label>Capacity:</label>
            <input
              className="event-info"
              type="number"
              required
              value={capacity}
              onChange={capacityHandler}
            />
            {/* <p>{errors.capacity}</p> */}
          </div>
          <div>
            <label>Price:</label>
            <input
              className="event-info"
              type="text"
              required
              min="0.00"
              step="0.01"
              value={price}
              onChange={priceHandler}
            />
            {/* <p>{errors.price}</p> */}
          </div>
        </div>
        <div className="type_venue-container">
          <div>
            <label>Type:</label>
            <select
              className="event-info"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option disabled value="">
                Please Select One
              </option>
              <option value="In person">In person</option>
              <option value="Online">Online</option>
            </select>
            {/* <p>{errors.type}</p> */}
          </div>
          <div>
            <label>Venue:</label>
            <select
              className="event-info"
              required
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
            >
              <option disabled value="">
                Please Select One
              </option>
              <option value="null">No venue</option>
              {venues?.map((venue) => {
                return (
                  <option key={venue.id} value={venue.id}>
                    {venue.address} · {venue.city}, {venue.state}
                  </option>
                );
              })}
            </select>
            {/* <p>{errors.venueId}</p> */}
          </div>
        </div>
        <div className="date-container">
          <div>
            <label>Start Date:</label>
            <input
              className="event-info"
              type="datetime-local"
              required
              min={new Date().toISOString().slice(0, 16)}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            ></input>
            {/* <p>{errors.startDate}</p> */}
          </div>
          <div>
            <label>End Date:</label>
            <input
              className="event-info"
              type="datetime-local"
              required
              disabled={!startDate}
              min={startDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            ></input>
            {/* <p>{errors.endDate}</p> */}
          </div>
        </div>
        <div className="buttons-container">
          <button disabled={name.length < 5} type="submit">
            {formType} Event
          </button>
          <button onClick={closeForm}>Cancel</button>
        </div>
      </form>
    </section>
  );
};

export default EventForm;
