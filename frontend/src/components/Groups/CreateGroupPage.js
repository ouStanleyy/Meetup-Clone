import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createGroup, editGroup } from "../../store/groups";
import "./CreateGroupPage.css";

const CreateGroupPage = ({ closeForm, group, formType }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const locationRef = useRef();
  const [name, setName] = useState(group.name);
  const [about, setAbout] = useState(group.about);
  const [type, setType] = useState(group.type);
  const [privacy, setPrivacy] = useState(group.private);
  const [location, setLocation] = useState("");
  const [city, setCity] = useState(group.city);
  const [state, setState] = useState(group.state);
  const [errors, setErrors] = useState({});
  const [wiggle, setWiggle] = useState(false);
  const [page, setPage] = useState(1);

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

  const backHandler = (e) => {
    e.preventDefault();
    setPage((state) => --state);
  };

  const nextHandler = (e) => {
    e.preventDefault();
    setPage((state) => ++state);
  };

  useEffect(() => {
    if (locationRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        locationRef.current,
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

        setLocation(
          `${city.locality?.long_name}, ${city.administrative_area_level_1?.short_name}`
        );
        setCity(city.locality?.long_name);
        setState(city.administrative_area_level_1?.short_name);
      });
    }
  });

  useEffect(() => {
    0 < about.length && about.length < 50
      ? setErrors({ about: "Please write at least 50 characters" })
      : setErrors({});
  }, [about]);

  return (
    <section className="groupCreate section">
      <form className="groupCreate form" onSubmit={submitHandler}>
        {page === 1 && (
          <div className="groupCreate details">
            <h1>First, set your group's location.</h1>
            <h3>
              Meetup groups meet locally, in person and online. We'll connect
              you with people in your area, and more can join you online.
            </h3>
            <input
              className="group-info"
              type="text"
              ref={locationRef}
              placeholder="Search for a city"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        )}
        {page === 2 && (
          <div className="groupCreate details">
            <h1>What will your group's name be?</h1>
            <h3>
              Choose a name that will give people a clear idea of what the group
              is about. Feel free to get creative! You can edit this later if
              you change your mind.
            </h3>
            <input
              className="group-info"
              type="text"
              placeholder="Your group's name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {page === 3 && (
          <div className="groupCreate details">
            <h1>
              Now describe what{" "}
              <span style={{ fontStyle: "italic" }}>
                {name.length > 50 ? `${name.slice(0, 50)}...` : name}{" "}
              </span>
              will be about.
            </h1>
            <h3>
              People will see this when we promote your group, but you'll be
              able to add to it later, too.
            </h3>
            <ol>
              <li style={{ listStyle: "number" }}>
                What's the purpose of the group?
              </li>
              <li style={{ listStyle: "number" }}>Who should join?</li>
              <li style={{ listStyle: "number" }}>
                What will you do at your events?
              </li>
            </ol>
            <textarea
              className="group-info"
              placeholder="Please write at least 50 characters"
              required
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
        )}
        {page === 4 && (
          <div className="groupCreate details">
            <h1>
              Lastly - decide if your group will meet online or in person, and
              if it will be open to the public.
            </h1>
            <h3>
              Nowadays, people can enjoy social events virtually and it is no
              less exciting than meeting up in person!
            </h3>
            <div className="type-container">
              <h4>Type: </h4>
              <input
                className="inPerson checkbox"
                type="checkbox"
                value="In person"
                checked={type === "In person"}
                onChange={(e) => setType(e.target.value)}
              />
              <input
                className="online checkbox"
                type="checkbox"
                value="Online"
                checked={type === "Online"}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="privacy-container">
              <h4>Private: </h4>
              <input
                className="private checkbox"
                type="checkbox"
                value="true"
                checked={privacy === "true"}
                onChange={(e) => setPrivacy(e.target.value)}
              />
              <input
                className="public checkbox"
                type="checkbox"
                value="false"
                checked={privacy === "false"}
                onChange={(e) => setPrivacy(e.target.value)}
              />
            </div>
          </div>
        )}
        <div className="groupCreate buttons-container">
          {page > 1 && <button onClick={backHandler}>Back</button>}
          {page < 4 ? (
            <button
              disabled={
                (page === 1 && !city) ||
                (page === 2 && name.length < 5) ||
                (page === 3 && about.length < 50)
              }
              onClick={nextHandler}
            >
              Next
            </button>
          ) : (
            <button disabled={!type || !privacy} type="submit">
              Done
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default CreateGroupPage;
