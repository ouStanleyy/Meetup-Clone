import EventForm from "./EventForm";

const CreateEventForm = () => {
  const event = {
    name: "",
    about: "",
    type: "",
    private: "",
    city: "",
    state: "",
  };

  return <EventForm event={event} formType="Create" />;
};

export default CreateEventForm;
