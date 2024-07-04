import React, { useState } from "react";
import "./Booking.css";
import Offcanvas from "react-bootstrap/Offcanvas";
import Loading from "../Components/Loading/Loading";
import CurrentStatusCard from "./CurrentStatusCard";
import Notdata from "../Components/Loading/Notdata";
import { fetchData } from "../../apiUtils/apiFunctions";
function ActiveBooking({ name, ...props }) {
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [currentBookingData, setCurrentBookingData] = useState([]);
  const [upcomingBookingData, setUpcomingBookingData] = useState([]);
  const getApiData = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const url = "/bookings";
      const bookingDataRes = await fetchData(url, token);
      setCurrentBookingData(bookingDataRes.todays_bookings);
      setUpcomingBookingData(bookingDataRes.upcoming_bookings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  const handleUpdate = () => {
    getApiData();
  };

  return (
    <>
      <div
        variant="primary"
        onClick={() => {
          getApiData();
          setShow(true);
        }}
        className="me-2"
        title="View Your Active Bookings"
      >
        Active Bookings
      </div>

      <Offcanvas
        className="Offcanvas"
        style={{ width: "70%" }}
        show={show}
        onHide={() => setShow(false)}
        {...props}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="ofcanvasTitle"></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <h2
              className="ofcanvasTitle"
              style={{
                marginLeft: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              Today's Booking
            </h2>
            {loading ? (
              <Loading />
            ) : (
              <>
                {currentBookingData.length === 0 ? (
                  <Notdata error="Current Bookings Not Found" />
                ) : (
                  <div className="currentStatus">
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
                            Organizer Name
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
                            Edit
                          </th>
                          <th scope="col" className="text-center">
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBookingData.map((item, index) => (
                          <CurrentStatusCard
                            key={item.id}
                            index={index}
                            id={item.id}
                            Rname={item.meetingRoomName}
                            Issuer={item.userName}
                            lname={item.lastName}
                            Date={item.date}
                            from={item.startTime}
                            to={item.endTime}
                            onUpdate={handleUpdate}
                            status={item.status}
                            userId={item.userId}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          <hr />
          <div>
            <h2
              className="ofcanvasTitle"
              style={{
                marginLeft: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              Upcoming Bookings
            </h2>
            {loading ? (
              <Loading />
            ) : (
              <>
                {upcomingBookingData.length === 0 ? (
                  <Notdata error="Upcoming Bookings Not Found" />
                ) : (
                  <div className="currentStatus">
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
                            Organizer Name
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
                            Edit
                          </th>
                          <th scope="col" className="text-center">
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingBookingData.map((item, index) => (
                          <CurrentStatusCard
                            key={item.id}
                            index={index}
                            id={item.id}
                            Rname={item.meetingRoomName}
                            Issuer={item.userName}
                            lname={item.lastName}
                            Date={item.date}
                            from={item.startTime}
                            to={item.endTime}
                            onUpdate={handleUpdate}
                            status={item.status}
                            userId={item.userId}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
export default ActiveBooking;
