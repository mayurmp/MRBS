import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminRoomDetailsCard from "../Component/AdminRoomDetailsCard";
const AdminRoomDetails = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isUserLoggedIn = !!sessionStorage.getItem("Admin");
    if (!isUserLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);
  return (
    <div>
      <div className="AdminRoomDetails">
        <AdminRoomDetailsCard />
      </div>
    </div>
  );
};

export default AdminRoomDetails;
