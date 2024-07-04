import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Form, Modal, Button } from "react-bootstrap";
import "../components/DeskBookTable.css";
import "./modal.styles.css";
import {
  deleteData,
  fetchData,
  patchData,
  postData,
} from "../../apiUtils/apiFunctions";
import ConfirmationModel from "./ConfirmationModel";

const AddNewDesk = ({ isOpen, isClose, deskData, isEdit, reset }) => {
  const [deskNumber, setDeskNumber] = useState("");
  const [deskType, setDeskType] = useState("");
  const [deskArea, setDeskArea] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [message, setMessage] = useState("");
  const [bookDesk, setBookDesk] = useState([]);
  const [deskDelete, setDeskDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const deskNameInputRef = useRef(null);
  const location = useLocation();

  /* This `useEffect` hook is responsible for setting up initial values for the desk type, desk area,and focusing on the desk name input field when the `isOpen` prop changes.*/
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setDeskType("Hot Desk");
    setDeskArea("General Area");
    setDeskNumber("");
    if (deskNameInputRef?.current) {
      deskNameInputRef?.current.focus();
    }
  }, [isOpen]);

  /* This `useEffect` hook is responsible for fetching desk data based on certain conditions and updating desk information accordingly.*/
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const fetchDeskData = async () => {
      try {
        const url = `/desk/${deskData?.Id}`;
        const token = JSON.parse(sessionStorage.getItem("token"));
        const deskFetchRes = await fetchData(url, token);
        setDeskNumber(deskFetchRes[0]?.DeskName.split(" ")[1]);
        setDeskType(deskFetchRes[0]?.DeskType);
        setDeskArea(deskFetchRes[0]?.DeskArea);
      } catch (error) {}
    };
    if (isEdit) {
      fetchDeskData();
    }
  }, [isOpen, isEdit, deskData]);

  /* The isValidDeskNumber function checks if a given value is in the format "Desk" followed by up to 3 digits. */
  const isValidDeskNumber = (value) => {
    return /^Desk \d{0,3}$/.test(value) && value.split(" ")[1].length <= 3;
  };

  /* The function `handleDeskNameChange` extracts the desk number from the input value, and sets the desk number state if it is valid. */
  const handleDeskNameChange = (event) => {
    setError("");
    const { value } = event.target;
    if (isValidDeskNumber(value)) {
      const deskNumber = value.split(" ")[1];
      setDeskNumber(deskNumber);
    }
  };

  /* The function `handleAddNewDesk` is responsible for adding or editing a desk with the provided details and handling success or error messages accordingly.*/
  const handleAddNewDesk = async (e) => {
    e.preventDefault();
    try {
      setIsAdding(true);
      const token = JSON.parse(sessionStorage.getItem("token"));
      let url;

      let addNewDeskRes;
      const initialRequestBody = {
        DeskName: `Desk ${deskNumber}`,
        DeskType: deskType,
        DeskArea: deskArea,
        Status: "Active",
      };
      if (isEdit) {
        url = `/desk/${deskData?.Id}`;
        addNewDeskRes = await patchData(url, token, initialRequestBody);
      } else {
        url = `/desk`;
        addNewDeskRes = await postData(url, initialRequestBody, token);
      }
      if (addNewDeskRes) {
        setConfirmModal(true);
        if (isEdit) {
          setMessage("Desk Edited Succesfully...");
          setBookDesk({ deskName: addNewDeskRes[0]?.DeskName });
        } else {
          setMessage("Desk Added Succesfully...");
          setBookDesk({ deskName: addNewDeskRes?.DeskName });
        }
        isClose();
        if (location.pathname === "/admin/deskbooking") {
          reset();
        }
      }
      setIsAdding(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while processing your request."
      );
      setIsAdding(false);
    }
  };

  /* The `confirmDeleteDesk` function deletes a desk using an API call and displays a success or error message in a modal.*/
  const confirmDeleteDesk = async () => {
    try {
      setIsDeleting(true);
      const token = JSON.parse(sessionStorage.getItem("token"));
      const url = `/desk/${deskData?.Id}`;
      await deleteData(url, token);
      isClose();
      setShowModal(true);
      setModalMessage("Desk deleted Successfully");
      setModalType("success");
      setIsDeleting(false);
      reset();
    } catch (error) {
      setShowModal(true);
      setModalMessage("Desk is Not Deleted");
      setModalType("error");
      setIsDeleting(false);
      isClose();
    }
  };
  const handleConfirModalClose = () => {
    setConfirmModal(false);
  };
  const handleCloseAddNewDesk = () => {
    isClose();
    setError("");
  };

  return (
    <div>
      <Modal show={isOpen} onHide={handleCloseAddNewDesk} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? (
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    marginRight: "2rem",
                    backgroundColor: "#f2f2f2",
                    color: "#33333",
                    padding: "2px 10px",
                    borderRadius: "5px",
                  }}
                >
                  {deskData?.deskNumber}
                </div>{" "}
                <div
                  className="BookingFormHeading"
                  style={{ marginRight: "10px" }}
                >
                  {deskData?.deskName}
                </div>
              </div>
            ) : (
              <h1 className="BookingFormHeading">Add a New Desk</h1>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="main">
            {" "}
            <form onSubmit={handleAddNewDesk}>
              <div className="form-element-container">
                <Form.Label className="form-title-lable">Desk Name*</Form.Label>
                <div className="BookingFormTitleInput">
                  <Form.Control
                    type="text"
                    name="title"
                    value={"Desk " + deskNumber}
                    onChange={handleDeskNameChange}
                    id="inputPassword5"
                    aria-describedby="passwordHelpBlock"
                    required
                    ref={deskNameInputRef}
                  />
                </div>
              </div>
              {error && (
                <div
                  style={{
                    color: "red",
                    fontSize: "14px",
                    marginTop: "3px",
                    marginLeft: "12rem",
                  }}
                >
                  {error}
                </div>
              )}

              <div className="form-element-container">
                <Form.Label className="form-title-lable">Desk Type*</Form.Label>
                <div className="BookingFormTitleInput">
                  <Form.Select
                    aria-label="Default select example"
                    style={{ border: "1px solid black" }}
                    value={deskType}
                    onChange={(e) => setDeskType(e.target.value)}
                  >
                    <option value="Dedicated Desk">Dedicated</option>
                    <option value="Hot Desk">Hot Desk</option>
                  </Form.Select>
                </div>
              </div>
              <div className="form-element-container">
                <Form.Label className="form-title-lable">Desk Area*</Form.Label>
                <div className="BookingFormTitleInput">
                  <Form.Select
                    aria-label="Default select example"
                    style={{ border: "1px solid black" }}
                    value={deskArea}
                    onChange={(e) => setDeskArea(e.target.value)}
                  >
                    <option value="General Area">General Area</option>
                    <option value="Upstairs">Upstairs</option>
                    <option value="Downstairs">Downstairs</option>
                    <option value="Main Floor">Main Floor</option>
                    <option value="Outdoor Area">Outdoor Area</option>
                    <option value="Conference Room">Conference Room</option>
                  </Form.Select>
                </div>
              </div>
              {isEdit ? (
                <div
                  style={{
                    textAlign: "right",
                    marginBottom: "10px",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    type="submit"
                    variant="primary"
                    className={isAdding ? "disabled" : ""}
                    disabled={isAdding || !deskNumber}
                    style={{ opacity: isAdding || !deskNumber ? 0.5 : 1 }}
                  >
                    {isAdding ? "Loading..." : "Save"}
                  </Button>{" "}
                  <Button
                    variant="danger"
                    className={isDeleting ? "disabled" : ""}
                    style={{ opacity: isDeleting && 0.5 }}
                    onClick={() => setDeskDelete(true)}
                  >
                    {isDeleting ? "Loading..." : "Delete"}
                  </Button>{" "}
                  <Button variant="secondary" onClick={isClose}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="BookingFormSaveBtn">
                  <button
                    type="submit"
                    className={isAdding ? "disabled" : ""}
                    disabled={isAdding || !deskNumber}
                    style={{ opacity: isAdding || !deskNumber ? 0.5 : 1 }}
                  >
                    {" "}
                    {isAdding ? "Loading..." : "Add"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <ConfirmationModel
        isEdit={true}
        isNewDesk={!isEdit}
        showModal={confirmModal}
        handleModalClose={handleConfirModalClose}
        message={message}
        bookPerson={bookDesk}
      />{" "}
      <Modal
        className="nav-modal-container"
        show={deskDelete}
        onHide={() => setDeskDelete(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Desk</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this desk?</Modal.Body>
        <Modal.Footer className="nav-modal-footer">
          <Button
            variant="secondary"
            onClick={() => {
              setDeskDelete(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              confirmDeleteDesk();
              setDeskDelete(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>{" "}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "success" ? "Success" : "Error"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={modalType === "success" ? "success" : "danger"}
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddNewDesk;
