import VenueForm from "./VenueForm";

const CreateVenueForm = ({ onClose }) => {
  const venue = {
    address: "",
    city: "",
    state: "",
    lat: 0,
    lng: 0,
  };

  return <VenueForm closeForm={onClose} venue={venue} formType="Create" />;
};

export default CreateVenueForm;
