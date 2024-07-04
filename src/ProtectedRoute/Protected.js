import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Protected(props) {
  const { Components } = props;
  const navigate = useNavigate();
  useEffect(() => {
    let login = JSON.parse(sessionStorage.getItem("token"));

    if (!login) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div>
      <Components />
    </div>
  );
}
