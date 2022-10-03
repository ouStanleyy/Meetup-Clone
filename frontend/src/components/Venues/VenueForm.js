import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createVenue, editVenue } from "../../store/groups";

const VenueForm = ({ closeForm, venue, formType }) => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const [address, setAddress] = useState(venue.address);
  const [city, setCity] = useState(venue.city);
  const [state, setState] = useState(venue.state);
  const [lat, setLat] = useState(venue.lat);
  const [lng, setLng] = useState(venue.lng);
  const [errors, setErrors] = useState({});
  const [wiggle, setWiggle] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    venue = {
      ...venue,
      address,
      city,
      state,
      lat: Number(lat),
      lng: Number(lng),
    };

    try {
      await dispatch(
        formType === "Create"
          ? createVenue(groupId, venue)
          : editVenue(groupId, venue)
      );
      closeForm();
    } catch (err) {
      setWiggle(true);
      setErrors({ ...err, ...err.errors });
    }
  };

  const latHandler = ({ target: { value } }) => {
    if (value.length > 1 && value.startsWith(0) && !value.includes("."))
      setLat(value.slice(1));
    else if (value < -90) setLat(-90);
    else if (value > 90) setLat(90);
    else if (value.split(".")[1]?.length > 6)
      setLat(value.slice(0, value.length - (value.split(".")[1].length - 6)));
    else setLat(value);
  };
  const lngHandler = ({ target: { value } }) => {
    if (value.length > 1 && value.startsWith(0) && !value.includes("."))
      setLng(value.slice(1));
    else if (value < -180) setLng(-180);
    else if (value > 180) setLng(180);
    else if (value.split(".")[1]?.length > 6)
      setLng(value.slice(0, value.length - (value.split(".")[1].length - 6)));
    else setLng(value);
  };

  return (
    <section className="venueForm-section">
      <form className="venue-form" onSubmit={submitHandler}>
        <div className="errors">
          {errors.status && (
            <h3
              onAnimationEnd={() => setWiggle(false)}
              className={wiggle ? "errors-wiggle" : ""}
            >
              Venue creation failed: {errors.message}
            </h3>
          )}
        </div>
        <label>Address</label>
        <input
          className="venue-info"
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <p>{errors.address}</p>
        <label>City</label>
        <input
          className="venue-info"
          type="text"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <p>{errors.city}</p>
        <label>State</label>
        <input
          className="venue-info"
          type="text"
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <p>{errors.city}</p>
        <label>Latitude</label>
        <input
          className="venue-info"
          type="number"
          required
          value={lat}
          onChange={latHandler}
        />
        <p>{errors.lat}</p>
        <label>Longitude</label>
        <input
          className="venue-info"
          type="number"
          required
          value={lng}
          onChange={lngHandler}
        />
        <p>{errors.lng}</p>
        <button type="submit">{formType} Venue</button>
        <button onClick={closeForm}>Cancel</button>
      </form>
    </section>
  );
};

export default VenueForm;
