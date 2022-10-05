import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
// import { createVember, editVember } from "../../store/groups";

const EditMember = ({ member, onUpdate }) => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const addressRef = useRef();
  const cityRef = useRef();
  const [address, setAddress] = useState(member.address);
  const [city, setCity] = useState(member.city);
  const [state, setState] = useState(member.state);
  const [lat, setLat] = useState(member.lat);
  const [lng, setLng] = useState(member.lng);
  const [errors, setErrors] = useState({});
  const [wiggle, setWiggle] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    // member = {
    //   ...member,
    //   address,
    //   city,
    //   state,
    //   lat: Number(lat),
    //   lng: Number(lng),
    // };

    // try {
    //   await dispatch(
    //     formType === "Create"
    //       ? createVember(groupId, member)
    //       : editVember(groupId, member)
    //   );
    //   closeForm();
    // } catch (err) {
    //   setWiggle(true);
    //   setErrors({ ...err, ...err.errors });
    // }
  };

  return (
    <section className="memberForm-section">
      <form className="member-form" onSubmit={submitHandler}>
        <button disabled={!lat && !lng} type="submit">
          Update Member
        </button>
        <button onClick={onUpdate}>Remove Member</button>
        <button onClick={onUpdate}>Cancel</button>
      </form>
    </section>
  );
};

export default EditMember;
