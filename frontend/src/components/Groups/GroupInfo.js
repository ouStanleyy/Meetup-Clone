import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { Modal } from "../../context/Modal";
import { getGroupById, deleteGroup } from "../../store/groups";
import EditGroupForm from "./EditGroupForm";
import "./Groups.css";

const GroupInfo = () => {
  const { groupId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups[groupId]);
  const organizer = useSelector(
    (state) => group?.organizerId === state.session.user.id
  );
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirect2, setRedirect2] = useState(false);
  const [redirect3, setRedirect3] = useState(false);
  const [redirect4, setRedirect4] = useState(false);

  const deleteHandler = async () => {
    await dispatch(deleteGroup(group.id));
    history.push("/your-groups");
  };

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getGroupById(groupId));
      } catch (err) {
        setRedirect(true);
        let redirectId = setTimeout(() => {
          setRedirect(false);
          setRedirect2(true);
          redirectId = setTimeout(() => {
            setRedirect2(false);
            setRedirect3(true);
            redirectId = setTimeout(() => {
              setRedirect3(false);
              setRedirect4(true);
            }, 1000);
          }, 1000);
        }, 1000);
        const timeoutId = setTimeout(() => history.push("/groups"), 4000);

        return () => {
          clearTimeout(timeoutId);
          clearTimeout(redirectId);
        };
      }
    })();
  }, [dispatch, groupId, history]);

  if (redirect)
    return (
      <h1>
        The group that you are looking for does not exit. You will be redirected
        to the groups page in a moment.
      </h1>
    );
  if (redirect2)
    return (
      <h1>
        The group that you are looking for does not exit. You will be redirected
        to the groups page in a moment.
        <p> Redirecting.</p>
      </h1>
    );
  if (redirect3)
    return (
      <h1>
        The group that you are looking for does not exit. You will be redirected
        to the groups page in a moment.
        <p> Redirecting..</p>
      </h1>
    );
  if (redirect4)
    return (
      <h1>
        The group that you are looking for does not exit. You will be redirected
        to the groups page in a moment.
        <p> Redirecting...</p>
      </h1>
    );

  return (
    group && (
      <div className="groupInfo-container">
        <div className="groupInfo-header">
          <div className="groupInfo img-container">
            <img
              className="groupInfo img"
              src={group.previewImage || group.Images?.[0]?.url}
              alt={group.previewImage || group.Images?.[0]?.url}
            />
          </div>
          {!showEdit ? (
            <div className="groupInfo-details">
              <h3 className="name">{group.name}</h3>
              <h4 className="group">
                {group.city}, {group.state}
              </h4>
              <p className="numMembers">
                {group.numMembers}{" "}
                {group.numMembers === 1 ? "member" : "members"}{" "}
                <span className="interpunct">·</span>{" "}
                <span className="type_private">
                  {group.type} {group.private ? "private" : "public"} group
                </span>
              </p>
              {organizer && (
                <>
                  <button onClick={() => setShowEdit(true)}>Edit</button>
                  <button>
                    <Link to={`/groups/${group.id}/images/add`}>Add Image</Link>
                  </button>
                  <button onClick={() => setShowModal(true)}>Delete</button>
                  {showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                      <div style={{ backgroundColor: "white" }}>
                        <p>
                          Are you sure you want to delete this group? This
                          action is permanent and cannot be reverted.
                        </p>
                        <button onClick={deleteHandler}>DELETE</button>
                        <button onClick={() => setShowModal(false)}>
                          CANCEL
                        </button>
                      </div>
                    </Modal>
                  )}
                </>
              )}
            </div>
          ) : (
            <EditGroupForm onUpdate={() => setShowEdit(false)} />
          )}
        </div>
        <h3>What we're about</h3>
        <p className="about">{group.about}</p>
      </div>
    )
  );
};

export default GroupInfo;
