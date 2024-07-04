import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDeskProtected(props) {
  const { Components } = props;
  const navigate = useNavigate();
  useEffect(() => {
    const isUserPresent = sessionStorage.getItem("usr");
    const isAdminPresent = sessionStorage.getItem("deskad");

    if (!isAdminPresent || isUserPresent) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div>
      <Components />
    </div>
  );
}
