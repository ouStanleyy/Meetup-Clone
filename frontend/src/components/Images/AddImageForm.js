import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { uploadImage } from "../../store/groups";

const AddImageForm = ({ onClose, addType }) => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [uploadChoice, setUploadChoice] = useState("url");
  const [url, setUrl] = useState("");
  // const [errors, setErrors] = useState({});

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      //   await dispatch(addType === "Group" ? addImage(groupId, { url }) : null);
      await dispatch(uploadImage(groupId, { url }));
      onClose();
      history.push(`/groups/${groupId}`);
    } catch (err) {
      // setErrors({ ...err, ...err.errors });
    }
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <label>How do you want to upload the image?</label>
        <select
          className="image-upload-choice"
          required
          value={uploadChoice}
          onChange={(e) => setUploadChoice(e.target.value)}
        >
          <option value="url">URL</option>
          <option value="pc">PC</option>
        </select>
        {uploadChoice === "pc" ? (
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            required
          />
        ) : (
          <>
            <label>Enter an https:// URL:</label>
            <input
              type="url"
              placeholder="https://example.com"
              pattern="https://.*"
              size="30"
              value={url}
              required
              onChange={(e) => setUrl(e.target.value)}
            />
          </>
        )}
        <button>Add Image</button>
      </form>
      <button onClick={onClose}>Cancel</button>
    </>
  );
};

export default AddImageForm;
