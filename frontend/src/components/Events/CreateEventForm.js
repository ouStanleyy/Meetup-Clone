import EventForm from "./EventForm";

const CreateEventForm = () => {
  const event = {
    name: "",
    description: "",
    type: "",
    capacity: 0,
    price: 0,
    startDate: "",
    endDate: "",
    venueId: null,
  };

  return <EventForm event={event} formType="Create" />;
};

export default CreateEventForm;
