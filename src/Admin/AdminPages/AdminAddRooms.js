import React, { useState, useEffect } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./AdminPages.css";
import AdminSidebar from "../Component/AdminSidebar";
import { postMultiFormData } from "../../apiUtils/apiFunctions";

const AdminAddRooms = () => {
  const [meetRoomName, setMeetRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const isUserLoggedIn = !!sessionStorage.getItem("Admin");
    if (!isUserLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);
  const handelName = (e) => {
    setMeetRoomName(e.target.value);
  };
  const handelCapacity = (e) => {
    setCapacity(e.target.value);
  };

  const handelImg = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (
      selectedFile.type === "application/x-moz-file" ||
      selectedFile.type === "application/x-msdos-program"
    ) {
      setShowModal(true);
      setModalMessage(
        "Please select an image file, not a folder or other file types."
      );
      setModalType("error");
      setIsAdding(false);
      e.target.value = null;
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      setShowModal(true);
      setIsAdding(false);
      setModalMessage("Please select a valid image file (JPEG or PNG).");
      setModalType("error");
      e.target.value = null;
      return;
    }

    if (selectedFile.size > maxSize) {
      setShowModal(true);
      setIsAdding(false);
      setModalMessage("Please select an image file with size up to 10 MB.");
      setModalType("error");
      e.target.value = null;
      return;
    }

    setImageUrl(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    const formData = new FormData();
    formData.append("meetRoomName", meetRoomName);
    formData.append("capacity", capacity);
    formData.append("imageurl", imageUrl);

    if (!/^[a-zA-Z\s]+$/.test(meetRoomName)) {
      setShowModal("Error");
      setModalMessage("Title must contain only letters.");
      setModalType("danger");
      setShowModal(true);
      setIsAdding(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("Admin");
      const url = "/meetrooms";
      const postMeetRoomRes = await postMultiFormData(url, token, formData);
      if (postMeetRoomRes) {
        setShowModal(true);
        setModalMessage("Meeting Room added successfully");
        setModalType("success");
        setIsAdding(false);
      }
    } catch (error) {
      console.error("Error occurred during post request:", error);
      setModalMessage("Error occurred during post request:");
      setModalType("error");
      setShowModal(true);
      setIsAdding(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);

    if (modalType === "success") {
      navigate("/admin/allrooms");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div className="Dashbord_admin" id="AdminAddRooms">
        <div className="AdminAddRooms">
          <div className="BookingForm">
            <div className="BookingFormCard">
              <Form onSubmit={handleSubmit} enctype="multipart/form-data">
                <h1 className="BookingFormHeading">Add a Meeting Room</h1>
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
                    Room Image *
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
                      required
                    />
                  </div>
                </div>
                <div className="BookingFormMTitle">
                  <Form.Label
                    className="BookingFormTitleLable"
                    htmlFor="inputPassword5"
                  >
                    Capacity *
                  </Form.Label>
                  <div className="BookingFormTitleInput">
                    <Form.Control
                      style={{ width: "200px" }}
                      type="number"
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
                    Status *
                  </Form.Label>
                  <div className="BookingFormTitleInput">
                    <Form.Select
                      aria-label="Default select example"
                      style={{ border: "1px solid black" }}
                    >
                      <option value="1">Active</option>
                      <option value="2">InActive</option>
                    </Form.Select>
                  </div>
                </div>
                <div className="BookingFormSaveBtn">
                  <button
                    type="submit"
                    className={isAdding ? "disabled" : ""}
                    disabled={isAdding}
                  >
                    {" "}
                    {isAdding ? "Loading..." : "Add"}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
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
};

export default AdminAddRooms;
