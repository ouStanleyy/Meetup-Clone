import "./Loader.css";
import { Modal } from "../../context/Modal";

const Loader = () => {
  return (
    <Modal>
      <div class="loader-container">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Modal>
  );
};

export default Loader;
