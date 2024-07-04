import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminProtected(props) {
  const { Components } = props;
  const navigate = useNavigate();
  useEffect(() => {
    let login = sessionStorage.getItem("Admin");

    if (!login) {
      navigate("/admin/login");
    }
  }, [navigate]);
  return (
    <div>
      <Components />
    </div>
  );
}
