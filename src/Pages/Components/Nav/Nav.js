import { React, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BiLogOut } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { fetchData } from "../../../apiUtils/apiFunctions";
import Techlogo from "../../../assets/techalchemy.png";
import "./Nav.css";
import MapIcon from "@mui/icons-material/Map";
import ViewFloorplansImages from "../../../DeskBooking/components/ViewFloorplansImages";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import AddNewDesk from "../../../DeskBooking/components/AddNewDesk";
import UploadFloorPlansImage from "../../../DeskBooking/components/UploadFloorPlansImage";
import ShowConfirmationPopup from "../../../DeskBooking/components/ShowConfirmationPopup";

export default function Nav({
  isDeskBookingUser,
  isDeskBookingAdmin,
  handleCurrentWeekData,
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);

  const [isAddNewDeskModalOpen, setIsAddNewDeskModalOpen] = useState(false);
  const [showFloorplansConfirmation, setShowFloorplansConfirmation] =
    useState(false);
  const navigate = useNavigate();
  const handleUploadFloorplansImage = () => {
    setShowFloorplansConfirmation(false);
    setIsUploadImageModalOpen(true);
  };
  const handleAddNewDesk = () => {
    setIsAddNewDeskModalOpen(true);
  };
  const handleCloseAddNewDesk = () => {
    setIsAddNewDeskModalOpen(false);
  };
  const handleUserFloorplans = () => {
    setShowFloorplansConfirmation(false);
    setIsModalOpen(true);
  };
  const handleAdminFloorplans = () => {
    setShowFloorplansConfirmation(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const confirmLogout = async () => {
    try {
      const url = "/logout";
      const token = JSON.parse(sessionStorage.getItem("token"));
      await fetchData(url, token);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("lastname");
      sessionStorage.removeItem("deskad");
      sessionStorage.removeItem("usr");

      setShowConfirmation(false);
      navigate("/login");
    } catch (error) {}
  };

  let linkComponent;

  if (isDeskBookingUser) {
    linkComponent = (
      <Link to="/deskbooking" className="linkaa">
        Desk Booking
      </Link>
    );
  } else if (isDeskBookingAdmin) {
    linkComponent = (
      <Link to="/admin/deskbooking" className="linkaa">
        Desk Booking
      </Link>
    );
  } else {
    linkComponent = (
      <Link to="/booking" className="linkaa">
        Overview
      </Link>
    );
  }
  return (
    <>
      <nav className="nav">
        <Link to="/home" className="title">
          <span className="span_logo">
            <img alt="Tech Logo" className="logo" src={Techlogo} />
          </span>
          {isDeskBookingUser || isDeskBookingAdmin ? <>DBS</> : <>MRBS</>}
        </Link>

        <ul className="link_name">
          <li>{linkComponent}</li>
          <li>
            {isDeskBookingUser ? (
              <Link to="/bookings" className="linkaa">
                Bookings
              </Link>
            ) : isDeskBookingAdmin ? (
              <Link to="/admin/bookings" className="linkaa">
                Bookings
              </Link>
            ) : (
              <Link to="/history" className="linkaa">
                Booking History
              </Link>
            )}
          </li>
          <li>
            {isDeskBookingAdmin && (
              <Link onClick={handleAddNewDesk} className="linkaa">
                <span>
                  <HiOutlineViewGridAdd />
                </span>{" "}
                Add New Desk
              </Link>
            )}
          </li>{" "}
          <li>
            {isDeskBookingUser && (
              <Link className="login" onClick={handleUserFloorplans}>
                <span className="floorplanlogo">
                  <MapIcon />
                </span>
                Floor Plans
              </Link>
            )}
          </li>{" "}
          <li>
            {isDeskBookingAdmin && (
              <Link className="login" onClick={handleAdminFloorplans}>
                <span className="floorplanlogo">
                  <MapIcon />
                </span>
                Floor Plans
              </Link>
            )}
          </li>{" "}
          <li>
            <Link className="login" onClick={handleLogout}>
              <span className="loginlogo1">
                <BiLogOut />
              </span>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
      <AddNewDesk
        isOpen={isAddNewDeskModalOpen}
        isClose={handleCloseAddNewDesk}
        reset={handleCurrentWeekData}
      />{" "}
      <ViewFloorplansImages
        isOpen={isModalOpen}
        isClose={handleCloseModal}
        isDeskBookingAdmin={isDeskBookingAdmin}
      />
      <UploadFloorPlansImage
        isOpen={isUploadImageModalOpen}
        isClose={() => setIsUploadImageModalOpen(false)}
      />
      <ShowConfirmationPopup
        isShow={showConfirmation}
        isHide={() => setShowConfirmation(false)}
        isCall={confirmLogout}
      />
      <Modal
        className="nav-modal-container"
        show={showFloorplansConfirmation}
        onHide={() => setShowFloorplansConfirmation(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Floor Plans Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          Would you like to view the floor plans image or upload a new one?
        </Modal.Body>
        <Modal.Footer className="nav-modal-footer">
          <Button variant="secondary" onClick={handleUserFloorplans}>
            View Floor Plans Images
          </Button>
          <Button variant="primary" onClick={handleUploadFloorplansImage}>
            Upload Floor Plans Image
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
