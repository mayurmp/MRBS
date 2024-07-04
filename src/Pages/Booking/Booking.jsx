import React, { useEffect } from "react";
import Nav from "../Components/Nav/Nav";
import "./Booking.css";
import RoomCards from "../Components/RoomCards/RoomCards";
import { useNavigate } from "react-router-dom";
import ActiveBooking from "./ActiveBooking";

const Booking = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isUserLoggedIn = !!sessionStorage.getItem("token");
    if (!isUserLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <div>
        <Nav />
      </div>
      <div className="allroom">
        <h1>Book a Meeting Room</h1>
        {["end"].map((placement, idx) => (
          <ActiveBooking
            className="Activebooking"
            key={idx}
            placement={placement}
            name={placement}
          />
        ))}
      </div>
      <div className="roomcardcontainer">
        <RoomCards />
      </div>
    </div>
  );
};

export default Booking;
