import "./Signout.scss";
import { Modal, Button } from "react-bootstrap";

const Signout = ({ screenVersion, handleLogout, showSignout, handleClose }) => {
  return (
    <Modal
      show={showSignout}
      centered
      backdrop="static"
      className={`${screenVersion}-signout-modal`}
    >
      <Modal.Header>
        <Modal.Title>Are you sure you want to sign out?</Modal.Title>
      </Modal.Header>
      <Modal.Footer className="signout-modal-footer">
        <Button
          variant="danger"
          onClick={() => {
            handleClose();
            handleLogout();
          }}
          className="signout-modal-footer-signout-button"
        >
          Sign out
        </Button>
        <Button
          variant="secondary"
          onClick={handleClose}
          className="signout-modal-footer-cancel-button"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Signout;
