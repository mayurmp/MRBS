import React from "react";
import TechAlchemy from "../../assets/TechAlchemy-black.png";
import { Link } from "react-router-dom";
import "./AdminLogin.css";
import "react-toastify/dist/ReactToastify.css";
import Api from "../../Api";
import { FcGoogle } from "react-icons/fc";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const AdminLogin = () => {
  const googleAuth = async () => {
    window.open(`${Api}/admingooglelogin`, "_self");
  };

  return (
    <div>
      <section className="signin_ad">
        <div className="login_container_ad">
          <Link to="/admin/allrooms">
            <img className="TAlogo_ad" alt="img" src={TechAlchemy} />
          </Link>
          <div className="signin_form_ad">
            <div className="form_title_ad">Welcome to MRBS Admin Hub</div>
            <button className="login_google_ad" onClick={googleAuth}>
              <span className="google_logo">
                <FcGoogle />
              </span>{" "}
              Log in with Google
            </button>{" "}
            <h3 className="form_title2_ad" style={{ marginTop: "2rem" }}>
              {" "}
              Explore User Login{" "}
              <Link
                to="/login"
                style={{
                  color: "blue",
                  textDecoration: "none",
                }}
              >
                <OpenInNewIcon style={{ fontSize: 20 }} />
              </Link>{" "}
            </h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
