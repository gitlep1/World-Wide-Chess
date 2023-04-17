import "./Guest.scss";
import { Form, Button, Modal } from "react-bootstrap";

const Guest = ({ showGuest, handleClose }) => {
  return (
    <section>
      <Modal show={showGuest} onHide={handleClose} backdrop="static">
        <h1>Signing in as guest ...</h1>
      </Modal>
    </section>
  );
};

export default Guest;
