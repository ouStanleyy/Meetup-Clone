import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { createEvent, updateEvent } from "../../store/events";
import { getGroupById } from "../../store/groups";

const EventForm = ({ onSubmit, event, formType }) => {
  const { groupId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description);
  const [type, setType] = useState(event.type);
  const [capacity, setCapacity] = useState(event.capacity);
  const [price, setPrice] = useState(`$${event.price.toFixed(2)}`);
  const [startDate, setStartDate] = useState(event.startDate);
  const [endDate, setEndDate] = useState(event.endDate);
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
    };

    try {
      const newEvent = await dispatch(
        formType === "Create" ? createEvent(groupId, event) : updateEvent(event)
      );
      history.push(`/events/${newEvent.id}`);
      onSubmit();
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
        <div className="errors">
          {errors.status && (
            <h3
              onAnimationEnd={() => setWiggle(false)}
              className={wiggle ? "errors-wiggle" : ""}
            >
              Event creation failed: {errors.message}
            </h3>
          )}
        </div>
        <label>Event Name</label>
        <input
          className="event-info"
          type="text"
          placeholder="Minimum of 5 characters"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>{errors.name}</p>
        <label>Description</label>
        <textarea
          className="event-info"
          placeholder="Details of your event"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p>{errors.description}</p>
        <label>Capacity</label>
        <input
          className="event-info"
          type="number"
          required
          value={capacity}
          onChange={capacityHandler}
        />
        <p>{errors.capacity}</p>
        <label>Price</label>
        <input
          className="event-info"
          type="text"
          required
          min="0.00"
          step="0.01"
          value={price}
          onChange={priceHandler}
        />
        <p>{errors.price}</p>
        <label>Type</label>
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
        <p>{errors.type}</p>
        <label>Start Date</label>
        <input
          className="event-info"
          type="datetime-local"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        ></input>
        <p>{errors.startDate}</p>
        <label>End Date</label>
        <input
          className="event-info"
          type="datetime-local"
          required
          min={startDate}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        ></input>
        <p>{errors.endDate}</p>
        <button disabled={name.length < 5} type="submit">
          {formType} Event
        </button>
      </form>
    </section>
  );
};

export default EventForm;