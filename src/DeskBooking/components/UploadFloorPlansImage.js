import React, { useState, useEffect, useCallback } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import "../components/DeskBookTable.css";
import "../components/modal.styles.css";
import {
  postMultiFormData,
  patchMultiFormData,
  fetchData,
} from "../../apiUtils/apiFunctions";
import ConfirmationModel from "./ConfirmationModel";

const UploadFloorPlansImage = ({
  isOpen,
  isClose,
  isEdit,
  selectedImageId,
  resetFloorPlan,
}) => {
  const [deskArea, setDeskArea] = useState("General Area");
  const [isUploading, setIsUploading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  /* The `fetchFloorPlanEdit` function is a `useCallback` used to fetch and set the desk area for editing a floor plan image.*/
  const fetchFloorPlanEdit = useCallback(async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const url = `/floorplan/${selectedImageId}`;

      const fetchedData = await fetchData(url, token);
      if (fetchedData) {
        setDeskArea(fetchedData[0]?.ImageName);
      }
    } catch (error) {}
  }, [selectedImageId]);

  /* This `useEffect` hook is responsible for managing side effects in the `UploadFloorPlansImage` component.*/
  useEffect(() => {
    if (isOpen) {
      setIsUploading(false);
      setImageUrl("");
    }
    if (isOpen && isEdit) {
      fetchFloorPlanEdit();
    }
  }, [fetchFloorPlanEdit, isOpen, isEdit]);

  const handleRemoveImage = () => {
    setImageUrl("");
    document.getElementById("inputPassword5").value = "";
  };
  /* The handleImg function checks if the selected file is a valid image (JPEG or PNG) and within the size limit of 10 MB before setting the image URL.*/
  const handleImg = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setShowModal(true);
      setIsUploading(false);
      setModalMessage("Please select a valid image file (JPEG or PNG).");
      setModalType("error");
      return;
    }

    if (file.size > maxSize) {
      setShowModal(true);
      setIsUploading(false);
      setModalMessage("Please select an image file with size up to 10 MB.");
      setModalType("error");
      return;
    }
    setImageUrl({ imageName: file.name, floorPlanImage: file });
  };

  const handleConfirModalClose = () => {
    setConfirmModal(false);
  };
  const handleCloseAddNewDesk = () => {
    isClose();
  };

  /* The function `handleUploadFloorPlansImages` is responsible for uploading floor plan images, either editing or adding them, and displaying success or error messages accordingly.*/
  const handleUploadFloorPlansImages = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("imageName", deskArea);
      if (imageUrl) {
        formData.append("floorPlanImage", imageUrl?.floorPlanImage);
      }
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (isEdit) {
        const url = `/floorplan/${selectedImageId}`;
        await patchMultiFormData(url, token, formData);
      } else {
        const url = `/floorplan`;
        await postMultiFormData(url, token, formData);
      }
      if (isEdit) {
        setMessage("Floor Plan Image Edited Successfully...");
        resetFloorPlan();
      } else {
        setMessage("Floor Plan Image Added Successfully...");
      }
      setConfirmModal(true);
      isClose();
      setIsUploading(false);
    } catch (error) {
      setShowModal(true);
      setModalMessage(
        error?.response?.data?.message ||
          "An error occurred while processing your request."
      );
      setModalType("error");
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Modal show={isOpen} onHide={handleCloseAddNewDesk} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 className="BookingFormHeading">
              {isEdit ? `Edit` : ` Upload`} Floor Plans Image
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="main">
            {" "}
            <form onSubmit={handleUploadFloorPlansImages}>
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
              </div>{" "}
              <div className="form-element-container">
                <Form.Label className="form-title-lable">
                  Floor plans Image*
                </Form.Label>
                <div className="BookingFormTitleInput">
                  <Form.Control
                    style={{ width: "250px" }}
                    type="file"
                    name="file"
                    onChange={handleImg}
                    id="inputPassword5"
                    aria-describedby="passwordHelpBlock"
                    accept="image/*"
                    required={!isEdit}
                  />{" "}
                  <p className="size-suggestion">(JPEG/PNG, Up to 10 MB)</p>
                </div>{" "}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {imageUrl && !isEdit && (
                  <div
                    style={{
                      marginRight: "10px",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(imageUrl?.floorPlanImage)}
                      alt={`Floor Plan`}
                      style={{
                        width: "100px",
                        height: "70px",
                        marginRight: "10px",
                      }}
                    />{" "}
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {imageUrl?.imageName}
                    </span>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "red",
                      }}
                      onClick={handleRemoveImage}
                    >
                      &#10006;
                    </button>
                  </div>
                )}
              </div>
              <div className="BookingFormSaveBtn">
                <button
                  type="submit"
                  className={isUploading ? "disabled" : ""}
                  disabled={isUploading}
                  style={{ opacity: isUploading ? 0.5 : 1 }}
                >
                  {" "}
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <ConfirmationModel
        isUploadFloorPlanImage={true}
        showModal={confirmModal}
        handleModalClose={handleConfirModalClose}
        message={message}
      />{" "}
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

export default UploadFloorPlansImage;
