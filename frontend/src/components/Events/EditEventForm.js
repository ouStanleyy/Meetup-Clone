import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import EventForm from "./EventForm";

const EditEventForm = ({ onUpdate }) => {
  const { eventId } = useParams();
  const event = useSelector((state) => state.events[eventId]);

  return <EventForm closeForm={onUpdate} event={event} formType="Update" />;
};

export default EditEventForm;
