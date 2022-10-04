import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createVenue, editVenue } from "../../store/groups";

const VenueForm = ({ closeForm, venue, formType }) => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const addressRef = useRef();
  const cityRef = useRef();
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

  // const latHandler = ({ target: { value } }) => {
  //   if (value.length > 1 && value.startsWith(0) && !value.includes("."))
  //     setLat(value.slice(1));
  //   else if (value < -90) setLat(-90);
  //   else if (value > 90) setLat(90);
  //   else if (value.split(".")[1]?.length > 7)
  //     setLat(value.slice(0, value.length - (value.split(".")[1].length - 7)));
  //   else setLat(value);
  // };
  // const lngHandler = ({ target: { value } }) => {
  //   if (value.length > 1 && value.startsWith(0) && !value.includes("."))
  //     setLng(value.slice(1));
  //   else if (value < -180) setLng(-180);
  //   else if (value > 180) setLng(180);
  //   else if (value.split(".")[1]?.length > 7)
  //     setLng(value.slice(0, value.length - (value.split(".")[1].length - 7)));
  //   else setLng(value);
  // };

  const addressBlurHandler = (e) => {
    setCity("");
    setState("");
    setLat(0);
    setLng(0);
  };

  useEffect(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      addressRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "US" },
        fields: ["address_components", "geometry", "url"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const address = place.address_components;

      if (!place.geometry) {
        setCity("");
        setState("");
        setLat(0);
        setLng(0);
      } else {
        setAddress(`${address[0].long_name} ${address[1].short_name}`);
        setCity(`${address[2].long_name}`);
        setState(`${address[5].short_name}`);
        setLat(place.geometry.location.lat().toFixed(7));
        setLng(place.geometry.location.lng().toFixed(7));
      }
    });

    // const autocompleteCity = new window.google.maps.places.Autocomplete(
    //   cityRef.current,
    //   {
    //     types: ["(cities)"],
    //     componentRestrictions: { country: "US" },
    //     fields: ["address_components", "geometry"],
    //   }
    // );

    // autocompleteCity.addListener("place_changed", () => {
    //   const city = autocompleteCity.getPlace().address_components;

    //   setCity(`${city[0].long_name}`);
    //   setState(`${city[3].short_name}`);
    // });
  }, []);

  return (
    <section className="venueForm-section">
      <form className="venue-form" onSubmit={submitHandler}>
        {/* <div className="errors">
          {errors.status && (
            <h3
              onAnimationEnd={() => setWiggle(false)}
              className={wiggle ? "errors-wiggle" : ""}
            >
              Venue creation failed: {errors.message}
            </h3>
          )}
        </div> */}
        <label>Address</label>
        <input
          className="venue-info"
          type="text"
          ref={addressRef}
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onBlur={addressBlurHandler}
        />
        {/* <p>{errors.address}</p> */}
        <label>City</label>
        <input
          className="venue-info"
          type="text"
          ref={cityRef}
          required
          disabled
          value={city}
          // onChange={(e) => setCity(e.target.value)}
        />
        {/* <p>{errors.city}</p> */}
        <label>State</label>
        <input
          className="venue-info"
          type="text"
          required
          disabled
          value={state}
          // onChange={(e) => setState(e.target.value)}
        />
        {/* <p>{errors.city}</p> */}
        <label>Latitude</label>
        <input
          className="venue-info"
          type="number"
          required
          disabled
          value={lat}
          // onChange={latHandler}
        />
        {/* <p>{errors.lat}</p> */}
        <label>Longitude</label>
        <input
          className="venue-info"
          type="number"
          required
          disabled
          value={lng}
          // onChange={lngHandler}
        />
        {/* <p>{errors.lng}</p> */}
        <button disabled={!lat && !lng} type="submit">
          {formType} Venue
        </button>
        <button onClick={closeForm}>Cancel</button>
      </form>
    </section>
  );
};

export default VenueForm;
