import React, { useState, useEffect } from "react";
import "./History.css";
import Nav from "../Components/Nav/Nav";
import Loading from "../Components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import Notdata from "../Components/Loading/Notdata";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { GrClose } from "react-icons/gr";
import { fetchData } from "../../apiUtils/apiFunctions";

const History = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [modalShowUn, setModalShowUn] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalVariant, setModalVariant] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const isUserLoggedIn = !!sessionStorage.getItem("token");
    if (!isUserLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
    const getApiData = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("token"));
        const url = "/mybookings";
        const myBookings = await fetchData(url, token);
        setUserData(myBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response) {
          if (error.response.data.status === 401) {
            setLoading(false);
            setModalTitle("Error");
            setModalMessage("Unauthorized. Please log in again");
            setModalVariant("danger");
            setModalShowUn(true);
          }
        }
        setLoading(false);
      }
    };
    getApiData();
  }, []);
  const handleCloseModalUn = () => {
    setModalShowUn(false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    navigate("/login");
  };
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Nav />
      {loading ? (
        <Loading />
      ) : (
        <>
          {userData.length === 0 ? (
            <Notdata error="History Not Found" />
          ) : (
            <div className="userTable">
              <div
                className="allroom"
                style={{ margin: "0px", marginBottom: "2.5rem" }}
              >
                <h1>User Booking History</h1>
                <div
                  onClick={handleGoBack}
                  className="me-2"
                  style={{ color: "#774181" }}
                >
                  <GrClose />
                </div>
              </div>
              <div className="table-responsive">
                <table
                  className="table table-striped table-bordered"
                  style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                >
                  <thead className="thead-dark">
                    <tr className="dark-row">
                      <th scope="col" className="text-center">
                        Sr.No.
                      </th>
                      <th scope="col" className="text-center">
                        Room Name
                      </th>
                      <th scope="col" className="text-center">
                        Title
                      </th>
                      <th scope="col" className="text-center">
                        Date
                      </th>
                      <th scope="col" className="text-center">
                        Start Time
                      </th>
                      <th scope="col" className="text-center">
                        End Time
                      </th>
                      <th scope="col" className="text-center">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{item.meetingRoomName}</td>
                          <td>{item.title}</td>
                          <td>{item.date}</td>
                          <td>{item.startTime}</td>
                          <td>{item.endTime}</td>
                          <td>{item.duration}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        show={modalShowUn}
        onHide={handleCloseModalUn}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant={modalVariant} onClick={handleCloseModalUn}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default History;
