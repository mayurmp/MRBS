import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TALOGO from "../../assets/TechAlchemy-black.png";
import { RxDashboard } from "react-icons/rx";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { SlLogout } from "react-icons/sl";
import { FiHelpCircle } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const confirmLogout = () => {
    setShowConfirmation(false);
    sessionStorage.removeItem("Admin");
    navigate("/admin/login");
  };

  const cancelLogout = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="AdminSidebarMain">
      <div className="AdminSidebar">
        <Link className="title" style={{ marginTop: "10px" }}>
          <span className="span_logo">
            <img src={TALOGO} alt="img" />
          </span>
          <span className="techtxt"> Tech Alchemy</span>
        </Link>

        <ul className="link_name" id="abminlink1">
          <li>
            <Link to="/dashbord" className="linkaa">
              <span>
                <RxDashboard />
              </span>{" "}
              Dashbord
            </Link>
          </li>

          <li>
            <Link to="/admin/allrooms" className="linkaa">
              <span>
                <MdOutlineMeetingRoom />
              </span>{" "}
              View All Rooms
            </Link>
          </li>

          <li>
            <Link to="/admin/addrooms" className="linkaa">
              <span>
                <HiOutlineViewGridAdd />
              </span>{" "}
              Add Rooms
            </Link>
          </li>
        </ul>

        <ul className="link_name2" id="abminlink2">
          <li className="help">
            <span>
              <FiHelpCircle />
            </span>{" "}
            Help & Information
          </li>

          <li>
            <Link className="linkaa" onClick={handleLogout}>
              <span>
                <SlLogout />
              </span>{" "}
              Logout
            </Link>
          </li>
        </ul>
      </div>

      <Modal show={showConfirmation} onHide={cancelLogout}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelLogout}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminSidebar;
