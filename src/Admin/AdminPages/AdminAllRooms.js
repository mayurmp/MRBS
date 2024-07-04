import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import "./AdminPages.css";
import AdminSidebar from "../Component/AdminSidebar";
import AdminRoomCard from "../Component/AdminRoomCard";

const AdminAllRooms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      sessionStorage.setItem("Admin", JSON.stringify(token));
    } else {
      console.error("Token and/or UserId not found in URL parameters.");
    }
  });
  useEffect(() => {
    const isUserLoggedIn = !!sessionStorage.getItem("Admin");
    if (!isUserLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div className="Dashbord" style={{ padding: "0rem" }}>
        <div className="allroom">
          <h1>All Meeting Rooms</h1>
          <Link
            to="/admin/addrooms"
            className="me-2"
            style={{ textDecoration: "none" }}
          >
            <span>
              <HiOutlineViewGridAdd />
            </span>{" "}
            Add Rooms
          </Link>
        </div>
        <AdminRoomCard />
      </div>
    </div>
  );
};

export default AdminAllRooms;
