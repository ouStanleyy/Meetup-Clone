import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createGroup, editGroup } from "../../store/groups";

const GroupForm = ({ closeForm, group, formType }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const cityRef = useRef();
  const [name, setName] = useState(group.name);
  const [about, setAbout] = useState(group.about);
  const [type, setType] = useState(group.type);
  const [privacy, setPrivacy] = useState(group.private);
  const [city, setCity] = useState(group.city);
  const [state, setState] = useState(group.state);
  const [errors, setErrors] = useState({});
  const [wiggle, setWiggle] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    group = { ...group, name, about, type, private: privacy, city, state };

    try {
      const newGroup = await dispatch(
        formType === "Create" ? createGroup(group) : editGroup(group)
      );
      history.push(`/groups/${newGroup.id}`);
      closeForm();
    } catch (err) {
      setWiggle(true);
      setErrors({ ...err, ...err.errors });
    }
  };

  useEffect(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      cityRef.current,
      {
        types: ["(cities)"],
        componentRestrictions: { country: "US" },
        fields: ["address_components", "geometry"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace().address_components;
      const city = {};

      place.forEach(
        (addressComp) => (city[addressComp.types[0]] = addressComp)
      );

      setCity(city.locality?.long_name);
      setState(city.administrative_area_level_1?.short_name);
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

  useEffect(() => {
    0 < about.length && about.length < 50
      ? setErrors({ about: "Please write at least 50 characters" })
      : setErrors({});
  }, [about]);

  return (
    <section className="groupForm-section">
      <form className="group-form" onSubmit={submitHandler}>
        {/* <div className="errors">
          {errors.status && (
            <h3
              onAnimationEnd={() => setWiggle(false)}
              className={wiggle ? "errors-wiggle" : ""}
            >
              Group creation failed: {errors.message}
            </h3>
          )}
        </div> */}
        <label>Group Name</label>
        <input
          className="group-info"
          type="text"
          placeholder="Group Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {/* <p>{errors.name}</p> */}
        <label>About</label>
        <textarea
          className="group-info"
          placeholder="Please write at least 50 characters"
          required
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
        {/* <p>{errors.about}</p> */}
        <label>City</label>
        <input
          className="group-info"
          type="text"
          ref={cityRef}
          placeholder="City"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {/* <p>{errors.city}</p> */}
        <label>State</label>
        <input
          className="group-info"
          type="text"
          placeholder="State"
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        {/* <p>{errors.state}</p> */}
        <label>Type</label>
        <select
          className="group-info"
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
        <label>Private</label>
        <select
          className="group-info"
          required
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
        >
          <option disabled value="">
            Please Select One
          </option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        {/* <p>{errors.private}</p> */}
        <button disabled={about.length < 50} type="submit">
          {formType} Group
        </button>
        <button onClick={closeForm}>Cancel</button>
      </form>
    </section>
  );
};

export default GroupForm;
