import React, { useEffect } from "react";
import "./AdminPages.css";
import AdminSidebar from "../Component/AdminSidebar";
import { useNavigate } from "react-router-dom";
import TaLogo from "../../assets/ta-logo-dashboard.png";

const Dashbord = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isUserLoggedIn = !!sessionStorage.getItem("Admin");
    if (!isUserLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div className="Dashbord">
        <div className="dash_main">
          <div className="dash_logo">
            <img alt="Tech Logo" className="dash_logo" src={TaLogo} />
          </div>
          <div className="com_name">
            <span className="techtxt1">TECH ALCHEMY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbord;
