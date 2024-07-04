import React from "react";
import TechAlchemy from "../../assets/TechAlchemy-black.png";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import loginbg from "../../assets/loginbg.png";
import { FcGoogle } from "react-icons/fc";
import Api from "../../Api";
const Login = () => {
  const googleAuth = async () => {
    window.open(`${Api}/google`, "_self");
  };
  return (
    <div>
      <section className="signin">
        <div className="login_container_user">
          <div className="left_collumn_lg">
            <div className="signin-content">
              <div className="signin_form">
                <img
                  className="TAlogo"
                  src={TechAlchemy}
                  alt="Tech Alchemy Logo"
                />
                <h2 className="form_title_lg">
                  Hi there!
                  <br /> Welcome back to MRBS and Desk Booking
                </h2>
                <button className="login_google" onClick={googleAuth}>
                  <span className="google_logo">
                    <FcGoogle />
                  </span>{" "}
                  Log in with Google
                </button>{" "}
              </div>{" "}
            </div>
          </div>
          <div className="right_collumn">
            <img className="loginbg" src={loginbg} alt="backgound img" />
          </div>
        </div>
      </section>
    </div>
  );
};
export default Login;
