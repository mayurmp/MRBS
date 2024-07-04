import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";
import Loading from "../../Pages/Components/Loading/Loading";
import { GrClose } from "react-icons/gr";
import Notdata from "../../Pages/Components/Loading/Notdata";
import { fetchData } from "../../apiUtils/apiFunctions";
function AdminRoomDetailsCard(props) {
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const handleGoBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const token = sessionStorage.getItem("Admin");
        const url = `/meetrooms/${id}`;
        const cardDataRes = await fetchData(url, token);
        console.log(cardDataRes);
        setCardData(cardDataRes);
        setLoading(false);
      } catch (error) {
        console.error("Error occurred during data fetching:", error);
        setLoading(false);
      }
    };
    fetchCardData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div
        className="allroom"
        style={{ margin: "0px", marginBottom: "2.5rem" }}
      >
        <h1>Room Booking History</h1>
        <div>
          <button
            onClick={handleGoBack}
            className="me-2"
            style={{ color: "#774181", border: "none" }}
          >
            <GrClose />
          </button>
        </div>
      </div>

      {cardData.length === 0 ? (
        <Notdata error="Details Not Found" />
      ) : (
        <div className="table-responsive">
          <table
            className="table table-striped table-bordered"
            style={{
              textAlign: "center",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            <thead className="thead-dark">
              <tr className="dark-row">
                <th scope="col">Sr.No.</th>
                <th scope="col">Organizer Name</th>
                <th scope="col">Title</th>
                <th scope="col">Attendees</th>
                <th scope="col">Date</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              {cardData.map((item, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      {item.userName} {item.lastName}
                    </td>
                    <td>{item.title}</td>
                    <td>{item.totalAttendees}</td>
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
      )}
    </>
  );
}

export default AdminRoomDetailsCard;
