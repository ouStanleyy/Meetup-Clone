import { useHistory } from "react-router";
import GroupForm from "./GroupForm";

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
    <GroupForm
      closeForm={() => history.push("/groups")}
      group={group}
      formType="Create"
    />
  );
};

export default CreateGroupForm;
