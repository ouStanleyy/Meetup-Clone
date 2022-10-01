import { useSelector } from "react-redux";
import VenueForm from "./VenueForm";

const EditVenueForm = ({ venue, onUpdate }) => {
  return <VenueForm closeForm={onUpdate} venue={venue} formType="Update" />;
};

export default EditVenueForm;
