import GroupForm from "./GroupForm";

const CreateGroupForm = () => {
  const group = {
    name: "",
    about: "",
    type: "",
    private: "",
    city: "",
    state: "",
  };

  return <GroupForm group={group} formType="Create" />;
};

export default CreateGroupForm;
