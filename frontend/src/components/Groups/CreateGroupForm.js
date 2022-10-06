import { useHistory } from "react-router";
import CreateGroupPage from "./CreateGroupPage";

const CreateGroupForm = () => {
  const history = useHistory();
  const group = {
    name: "",
    about: "",
    type: "",
    private: "",
    city: "",
    state: "",
  };

  return (
    <CreateGroupPage
      closeForm={() => history.push("/groups")}
      group={group}
      formType="Create"
    />
  );
};

export default CreateGroupForm;
