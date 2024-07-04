import React, { useEffect, useState } from "react";
import Nav from "../Components/Nav/Nav";
import Hero from "./component/Hero";
import RoomCardCards from "../Components/RoomCards/RoomDetailsCard/RoomCardCards";
import { useNavigate } from "react-router-dom";
import "../Components/Nav/Nav.css";
import jwt_decode from "jwt-decode";
const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      sessionStorage.setItem("token", JSON.stringify(token));
    }
  });
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      sessionStorage.setItem("userId", decodedToken.jwtData.id);
      sessionStorage.setItem("userName", decodedToken.jwtData.userName);
      sessionStorage.setItem("lastname", decodedToken.jwtData.last_name);
      const isAdmin = decodedToken.jwtData.role === "Admin";
      if (isAdmin) {
        sessionStorage.setItem("deskad", decodedToken.jwtData.role);
        setIsAdmin(true);
      } else {
        sessionStorage.setItem("usr", decodedToken.jwtData.role);
      }
    } else {
      console.error("Token not found in session storage.");
    }
  }, [navigate]);

  useEffect(() => {
    const isUserLoggedIn = !!sessionStorage.getItem("token");
    if (!isUserLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div>
      <div className="stickyClass">
        <Nav />
      </div>
      <div className="main">
        <Hero isAdmin={isAdmin} />
        <div className="allroom">
          <h1>Available Meeting Rooms</h1>
        </div>
        <div className="roomcardcontainer">
          <RoomCardCards />
        </div>
      </div>
    </div>
  );
};

export default Home;
