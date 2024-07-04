import React from "react";
import Heroimg from "../../../assets/Heroimg.png";
import TALOGO from "../../../assets/talogoblack.jpeg";
import { Link } from "react-router-dom";
import "../Home.css";

const Hero = ({ isAdmin }) => {
  return (
    <div>
      <div className="hero">
        <div className="hero_container">
          <div className="left_sidehero">
            <h1 className="hero_text1">
              Your One-Stop Solution for Effortless Meeting Room Management.
            </h1>
            <p className="hero_text2">
              Meeting room booking system provides a seamless and efficient
              solution for reserving meeting rooms in our office. With our
              user-friendly interface, you can easily browse through available
              rooms, select the desired time slot, and book it instantly.
            </p>
            <Link to="/booking">
              <button id="knowmore" className="form-submit knowmore">
                <span>
                  <img style={{ height: "2rem" }} src={TALOGO} alt="TAlogo" />{" "}
                  Book a Meeting Room
                </span>
              </button>
            </Link>
            {isAdmin ? (
              <Link to="/admin/deskbooking">
                <button
                  id="knowmore"
                  className="form-submit knowmore"
                  style={{ marginLeft: "1rem" }}
                >
                  <span>
                    <img style={{ height: "2rem" }} src={TALOGO} alt="TAlogo" />{" "}
                    Book a desk
                  </span>
                </button>
              </Link>
            ) : (
              <Link to="/deskbooking">
                <button
                  id="knowmore"
                  className="form-submit knowmore"
                  style={{ marginLeft: "1rem" }}
                >
                  <span>
                    <img style={{ height: "2rem" }} src={TALOGO} alt="TAlogo" />{" "}
                    Book a desk
                  </span>
                </button>
              </Link>
            )}
          </div>
          <div className="right_sidehero">
            <img className="QRillustrate" src={Heroimg} alt="img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
