import { Modal, Button } from "react-bootstrap";

const ShowConfirmationPopup = ({ isShow, isHide, isCall }) => {
  return (
    <Modal show={isShow} onHide={isHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to logout?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={isHide}>
          No
        </Button>
        <Button variant="primary" onClick={isCall}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ShowConfirmationPopup;
