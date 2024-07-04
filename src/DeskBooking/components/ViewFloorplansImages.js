import React, { useState, useCallback, useEffect } from "react";
import ImageViewer from "react-simple-image-viewer";
import { Modal, Button } from "react-bootstrap";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { deleteData, fetchData } from "../../apiUtils/apiFunctions";
import UploadFloorPlansImage from "./UploadFloorPlansImage";

function ViewFloorplansImages({ isOpen, isClose, isDeskBookingAdmin }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [noData, setNoData] = useState(false);
  const [uploadImagePopup, setUploadImagePopup] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [floorImageDelete, setFloorImageDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [imagesFetched, setImagesFetched] = useState(false);

  /* This `useEffect` hook is used to set the `currentImage` state to 0 whenever the `isOpen` prop changes. */
  useEffect(() => {
    if (isOpen) {
      setCurrentImage(0);
      getFloorPlansImages();
    }
  }, [isOpen]);

  /* The function `getFloorPlansImages` fetches floor plan images from a specified URL using a token for authentication and handles errors appropriately.*/
  const getFloorPlansImages = async () => {
    try {
      const url = "/floorplan";
      const token = JSON.parse(sessionStorage.getItem("token"));
      const floorPlansRes = await fetchData(url, token);
      if (floorPlansRes.length === 0) {
        setNoData(true);
      } else {
        const fetchedImages = floorPlansRes.map((item) => ({
          id: item.Id,
          imageName: item.ImageName,
          imagePath: item.Imagepath,
        }));
        setImages(fetchedImages);
        setImagesFetched(true);
      }
    } catch (error) {
      console.error("Error fetching floor plan images:", error);
      setNoData(true);
    }
  };

  /* This `useEffect` hook is responsible for fetching floor plan images using the
  `getFloorPlansImages` function when the component is opened (`isOpen` is true) and the images have not been fetched yet (`imagesFetched` is false).*/
  useEffect(() => {
    if (!isOpen || imagesFetched) return;
    if (!isOpen) {
      getFloorPlansImages();
    }
  }, [isOpen, currentImage, isDeskBookingAdmin, imagesFetched]);

  const openImageViewer = useCallback(() => {
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  /* The function `handlePrevImage` decreases the current image index by 1 if it is greater than 0.*/
  const handlePrevImage = () => {
    if (currentImage > 0) {
      setCurrentImage(currentImage - 1);
    }
  };

  /* The function `handleNextImage` increments the current image index by 1 if it is not already at the last image.*/
  const handleNextImage = () => {
    if (currentImage < images.length - 1) {
      setCurrentImage(currentImage + 1);
    }
  };

  const handleDeleteImage = async (id) => {
    setSelectedImageId(id);
    setFloorImageDelete(true);
  };

  /* The function `confirmDeleteImage` deletes an image from a floorplan and displays a success or error message in a modal.*/
  const confirmDeleteImage = async () => {
    try {
      const url = `/floorplan/${selectedImageId}`;
      const token = JSON.parse(sessionStorage.getItem("token"));
      const deleteDataRes = await deleteData(url, token);
      setSelectedImageId(null);
      setShowModal(true);
      setModalMessage(deleteDataRes.message);
      setModalType("success");
      getFloorPlansImages();
      setCurrentImage(0);
    } catch (error) {
      setShowModal(true);
      setModalMessage(error.response.data.message);
      setModalType("error");
    }
  };
  const handleUpload = (id) => {
    setSelectedImageId(id);
    setUploadImagePopup(true);
  };

  const handleCancel = () => {
    isClose();
  };

  return (
    <div>
      <Modal show={isOpen} onHide={isClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <h1 className="BookingFormHeading">View Floor Plans Images</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <Button disabled={currentImage === 0} onClick={handlePrevImage}>
                <ArrowCircleLeftIcon />
              </Button>{" "}
              <span style={{ margin: "0 8rem" }}>
                {noData ? "Image Not Found" : images[currentImage]?.imageName}
              </span>{" "}
              <Button
                disabled={
                  currentImage === images.length - 1 ||
                  images.length === 1 ||
                  noData
                }
                onClick={handleNextImage}
              >
                <ArrowCircleRightIcon />
              </Button>
            </div>
            {!noData && (
              <img
                src={images[currentImage]?.imagePath}
                onClick={openImageViewer}
                width="100%"
                style={{
                  margin: "auto",
                  display: "block",
                  maxHeight: "50vh",
                  transition: "transform 0.25s ease-in-out",
                }}
                alt="Floor Plans"
              />
            )}

            {isViewerOpen && (
              <ImageViewer
                src={images.map((image) => image.imagePath)}
                currentIndex={currentImage}
                disableScroll={false}
                closeOnClickOutside={true}
                onClose={closeImageViewer}
                zoomStep={0.1}
                showZoomControls={true}
                maxZoom={5}
              />
            )}
            {isDeskBookingAdmin && (
              <div
                style={{
                  textAlign: "right",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <Button
                  variant="primary"
                  disabled={noData}
                  onClick={() => handleUpload(images[currentImage]?.id)}
                >
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  disabled={noData}
                  onClick={() => handleDeleteImage(images[currentImage]?.id)}
                >
                  Delete
                </Button>{" "}
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
      <UploadFloorPlansImage
        isEdit={true}
        isOpen={uploadImagePopup}
        isClose={() => setUploadImagePopup(false)}
        selectedImageId={selectedImageId}
        resetFloorPlan={getFloorPlansImages}
      />
      <Modal
        className="nav-modal-container"
        show={floorImageDelete}
        onHide={() => setFloorImageDelete(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Floor Plans Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this floor plan image?
        </Modal.Body>
        <Modal.Footer className="nav-modal-footer">
          <Button
            variant="secondary"
            onClick={() => {
              setFloorImageDelete(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              confirmDeleteImage();
              setFloorImageDelete(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
}

export default ViewFloorplansImages;
