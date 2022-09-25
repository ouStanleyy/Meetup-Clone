import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GroupForm from "./GroupForm";

const EditGroupForm = ({ onUpdate }) => {
  const { groupId } = useParams();
  const group = useSelector((state) => state.groups[groupId]);

  return <GroupForm onSubmit={onUpdate} group={group} formType="Update" />;
};

export default EditGroupForm;
