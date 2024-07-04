import React from "react";
import { Modal } from "react-bootstrap";
import "../components/DeskBookTable.css";
import successImage from "../../assets/sucessImage.png";
import alertImage from "../../assets/alertImage.png";

export default function ConfirmationModel({
  showModal,
  handleModalClose,
  message,
  bookPerson,
  isNewDesk,
  isUploadFloorPlanImage,
  isEdit,
}) {
  let modalImage = null;
  let modalMessage = null;

  if (message === "Your Booking completed successfully") {
    modalImage = (
      <img src={successImage} alt="Success" className="modalImage" />
    );
    modalMessage = "Desk Booking Successful !";
  } else if (message === "Desk Added Succesfully...") {
    modalImage = (
      <img src={successImage} alt="Success" className="modalImage" />
    );
    modalMessage = "Desk Added Succesfully...";
  } else if (message === "Desk Edited Succesfully...") {
    modalImage = (
      <img src={successImage} alt="Success" className="modalImage" />
    );
    modalMessage = "Desk Edited Succesfully...";
  } else if (message === "Floor Plan Image Added Successfully...") {
    modalImage = (
      <img src={successImage} alt="Success" className="modalImage" />
    );
    modalMessage = "Floor Plan Image Added Successfully...";
  } else if (message === "Floor Plan Image Edited Successfully...") {
    modalImage = (
      <img src={successImage} alt="Success" className="modalImage" />
    );
    modalMessage = "Floor Plan Image Edited Successfully...";
  } else if (
    message === "Desk is Already Booked For You..." ||
    message === "Desk is Already Booked..."
  ) {
    modalImage = <img src={alertImage} alt="Error" className="modalImage" />;
    modalMessage = "Desk has been booked already !";
  } else {
    modalMessage = message;
  }

  return (
    <Modal className="modalComponent" show={showModal} centered>
      <Modal.Header>
        <div className="text-center">
          {modalImage}
          <h5>{modalMessage}</h5>
        </div>
      </Modal.Header>
      {!isUploadFloorPlanImage && (
        <Modal.Body>
          <div className="main">
            <div
              className="booktitle"
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "1rem",
              }}
            >
              <h6>
                {!isNewDesk && !isUploadFloorPlanImage && !isEdit && (
                  <b>Date: {bookPerson?.date}</b>
                )}
              </h6>
              <h6>
                <b>Desk Name: {bookPerson?.DeskName || bookPerson?.deskName}</b>
              </h6>
            </div>
          </div>
        </Modal.Body>
      )}

      <Modal.Footer>
        <button
          type="button"
          className="btn btn-primary booktitle"
          style={{ marginLeft: "1rem" }}
          onClick={handleModalClose}
        >
          OK
        </button>
      </Modal.Footer>
    </Modal>
  );
}
