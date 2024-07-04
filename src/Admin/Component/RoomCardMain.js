import { React, useState } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Form, Modal } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import { ImCross } from "react-icons/im";
import "./AdminSidebar.css";
import {
  deleteData,
  fetchData,
  patchMultiFormData,
} from "../../apiUtils/apiFunctions";

function RoomCardMain(props) {
  const [show, setShow] = useState(false);
  const [deleteDataConfirmation, setDeleteDataConfirmation] = useState(false);
  const [editSuccessModalShow, setEditSuccessModalShow] = useState(false);
  const [editNotModalShow, setEditNotModalShow] = useState(false);
  const [meetRoomName, setMeetRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("Active");
  const [imageUrl, setImageUrl] = useState(null);
  const [roomNameError, setRoomNameError] = useState(false);
  const [deleteSuccessModalShow, setDeleteSuccessModalShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handelName = (e) => {
    setMeetRoomName(e.target.value);
  };

  const handelCapacity = (e) => {
    setCapacity(e.target.value);
  };

  const handelImg = (e) => {
    const selectedFile = e.target.files[0];
    setImageUrl(selectedFile);
  };
  const editRoomData = async (id) => {
    try {
      const token = sessionStorage.getItem("Admin");
      const url = `/fetchroom/${id}`;
      const fetchRoomRes = await fetchData(url, token);
      setShow(true);
      setMeetRoomName(fetchRoomRes.meetRoomName);
      setCapacity(fetchRoomRes.capacity);
      setStatus(fetchRoomRes.status);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (meetRoomName.length < 3) {
      setRoomNameError(true);
      return;
    }
    setIsEditing(true);

    const formData = new FormData();
    formData.append("meetRoomName", meetRoomName);
    formData.append("capacity", capacity);
    if (imageUrl) {
      formData.append("imageurl", imageUrl);
    }
    formData.append("status", status);

    const regex = /^[a-zA-Z\s]+$/;
    if (!regex.exec(meetRoomName)) {
      setShowModal("Error");
      setModalMessage("Title must contain only letters.");
      setModalType("danger");
      setShowModal(true);
      setIsEditing(false);
      return;
    }
    try {
      const token = sessionStorage.getItem("Admin");
      const url = `/editroom/${props.id}`;
      const editRoomRes = await patchMultiFormData(url, token, formData);
      if (editRoomRes) {
        setEditSuccessModalShow(true);
        setIsEditing(false);
      }
    } catch (error) {
      setEditNotModalShow(true);
      setIsEditing(false);
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleCloseModal = () => {
    setShow(false);
    props.onUpdate();
  };

  const handleNavigateToAdminRooms = () => {
    setShow(false);
  };

  const deleteDataCall = async (id) => {
    try {
      setDeleteDataConfirmation(false);
      const token = sessionStorage.getItem("Admin");
      const url = `/deleteroom/${id}`;
      await deleteData(url, token);
      setDeleteSuccessModalShow(true);
    } catch (error) {
      console.error("Error deleting data:", error);
      setDeleteSuccessModalShow(true);
    }
  };
  const deleteDataConfirmationclose = () => {
    setDeleteDataConfirmation(false);
  };
  const getStatusStyle = () => {
    if (props.status === "Active") {
      return {
        color: "green",
        borderColor: "green",
      };
    } else if (props.status === "InActive") {
      return {
        color: "#e15b5b",
        borderColor: "#e15b5b",
      };
    }
    return {
      color: "black",
      borderColor: "black",
    };
  };

  const statusStyle = getStatusStyle();
  return (
    <div className="roomcard" style={{ width: "16rem" }}>
      <div>
        <div className="roomimg">
          <img
            alt="img"
            style={{ width: "14rem", height: "8rem" }}
            className="meetingRoom"
            src={props.img}
          />
        </div>
        <div style={{ display: "flex" }}>
          <h1 className="roomcardName">{props.Rname}</h1>
          <p
            className="roomcardStatus"
            style={{
              color: statusStyle.color,
              border: `1px solid ${statusStyle.borderColor}`,
            }}
          >
            {props.status}
          </p>{" "}
        </div>
        <div className="roomcardCapicity">
          <p className="capacity1">
            Capacity: <span>{props.inside}</span>
          </p>
          <div className="delete_but1">
            <span
              onClick={() => {
                editRoomData(props.id);
              }}
              className="but_log_del1"
            >
              <FiEdit3 className="Hovicon1" />
            </span>
            <Offcanvas
              show={show}
              onHide={() => setShow(false)}
              style={{ background: "padding-box" }}
            >
              <Offcanvas.Body>
                <div className="AdminAddRooms">
                  <div className="BookingForm">
                    <div className="BookingFormCard">
                      <Form
                        onSubmit={handleEditSubmit}
                        enctype="multipart/form-data"
                      >
                        <h1 className="BookingFormHeading">
                          Edit a Meeting Room
                        </h1>
                        <div
                          className="cross1"
                          onClick={handleNavigateToAdminRooms}
                        >
                          <ImCross />
                        </div>
                        <br />
                        <hr />
                        <div className="BookingFormMTitle">
                          <Form.Label
                            className="BookingFormTitleLable"
                            htmlFor="inputPassword5"
                          >
                            Room Name *
                          </Form.Label>
                          <div className="BookingFormTitleInput">
                            <Form.Control
                              type="text"
                              name="title"
                              value={meetRoomName}
                              onChange={handelName}
                              id="inputPassword5"
                              aria-describedby="passwordHelpBlock"
                              required
                            />
                          </div>
                        </div>
                        <div className="BookingFormMTitle">
                          <Form.Label
                            className="BookingFormTitleLable"
                            htmlFor="inputPassword5"
                          >
                            Change Room Image
                          </Form.Label>
                          <div className="BookingFormTitleInput">
                            <Form.Control
                              style={{ width: "250px" }}
                              type="file"
                              name="file"
                              onChange={handelImg}
                              id="inputPassword5"
                              aria-describedby="passwordHelpBlock"
                              accept="image/*"
                            />
                          </div>
                        </div>
                        <div className="BookingFormMTitle">
                          <Form.Label
                            className="BookingFormTitleLable"
                            htmlFor="inputPassword5"
                          >
                            Capacity
                          </Form.Label>
                          <div className="BookingFormTitleInput">
                            <Form.Control
                              style={{ width: "200px" }}
                              type="text"
                              name="startTime"
                              value={capacity}
                              onChange={handelCapacity}
                              id="inputPassword5"
                              aria-describedby="passwordHelpBlock"
                              required
                            />
                          </div>
                        </div>
                        <div className="BookingFormMTitle">
                          <Form.Label
                            className="BookingFormTitleLable"
                            htmlFor="inputPassword5"
                          >
                            Status
                          </Form.Label>
                          <div className="BookingFormTitleInput">
                            <Form.Select
                              aria-label="Default select example"
                              style={{ border: "1px solid black" }}
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value="Active">Active</option>
                              <option value="InActive">InActive</option>
                            </Form.Select>
                          </div>
                        </div>
                        <div className="BookingFormSaveBtn">
                          <button
                            type="submit"
                            className={isEditing ? "disabled" : ""}
                            disabled={isEditing}
                          >
                            {" "}
                            {isEditing ? "Loading..." : "Save"}
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>

            <span
              onClick={() => setDeleteDataConfirmation(true)}
              className="but_log_del1"
            >
              <AiOutlineDelete className="Hovicon1" />
            </span>
          </div>
        </div>

        <Link to={props.path}>
          <Button
            className="roomcardButton"
            variant="dark"
            style={{ width: "100%" }}
          >
            View Meeting History
          </Button>
        </Link>
      </div>
      <Modal show={deleteDataConfirmation} onHide={deleteDataConfirmationclose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to Delete Room ?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => deleteDataCall(props.id)}>
            Yes
          </Button>
          <Button variant="primary" onClick={deleteDataConfirmationclose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={editSuccessModalShow}
        onHide={() => {
          handleCloseModal();
          setEditSuccessModalShow(false);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Data edited successfully</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setEditSuccessModalShow(false);
              handleCloseModal();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={editNotModalShow}
        onHide={() => setEditNotModalShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>Network Error</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setEditNotModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={roomNameError}
        onHide={() => setRoomNameError(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          Meet Room Name length must be at least 3 characters long
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setRoomNameError(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={deleteSuccessModalShow}
        onHide={() => {
          props.onUpdate();
          setDeleteSuccessModalShow(false);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Room Deleted successfully</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              props.onUpdate();
              setDeleteSuccessModalShow(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "success" ? "Success" : "Error"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={modalType === "success" ? "success" : "danger"}
            onClick={closeModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default RoomCardMain;
