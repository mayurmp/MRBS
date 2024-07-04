import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDeskProtected(props) {
  const { Components } = props;
  const navigate = useNavigate();
  useEffect(() => {
    const isAdminPresent = sessionStorage.getItem("deskad");
    const isUserLoggedIn = !!sessionStorage.getItem("token");

    if (isAdminPresent || !isUserLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div>
      <Components />
    </div>
  );
}
