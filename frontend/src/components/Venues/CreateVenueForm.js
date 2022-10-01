import { useHistory, useParams } from "react-router";
import EventForm from "./VenueForm";

const CreateEventForm = () => {
  const history = useHistory();
  const { groupId } = useParams();
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

  return (
    <EventForm
      closeForm={() => history.push(`/groups/${groupId}`)}
      event={event}
      formType="Create"
    />
  );
};

export default CreateEventForm;
