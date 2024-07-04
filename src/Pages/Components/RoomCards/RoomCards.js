import { React, useState, useEffect } from "react";
import "./RoomCard.css";
import RoomCardMain from "./RoomCardMain";
import Loading from "../Loading/Loading";
import Notdata from "../Loading/Notdata";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../../apiUtils/apiFunctions";

const RoomCards = () => {
  const [loading, setLoading] = useState(true);
  const [myData, setMyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const userID = JSON.parse(sessionStorage.getItem("ticket"));
  useEffect(() => {
    const isUserLoggedIn = !!sessionStorage.getItem("token");
    if (!isUserLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const getApiData = async () => {
      try {
        const url = "/meetrooms";
        const token = JSON.parse(sessionStorage.getItem("token"));
        const myRoomsData = await fetchData(url, token);
        setMyData(myRoomsData);
      } catch (error) {
        console.error("Error fetching API data:", error);
      } finally {
        setLoading(false);
      }
    };
    getApiData();
  }, []);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = myData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {myData.length === 0 ? (
            <Notdata error="Rooms Not Available" />
          ) : (
            <div className="RoomCardCards">
              {currentItems.map((item) => {
                return (
                  <RoomCardMain
                    key={item.id}
                    id={item.id}
                    meetRoomId={userID}
                    name={item.meetRoomName}
                    img={item.imageUrl}
                    capacity={item.capacity}
                    status={item.status}
                    inside={item.capacity}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
      {myData.length > 8 ? (
        <div className="roompagination">
          <button
            className="hisbuttonpre"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
          >
            Previous
          </button>
          <span>{currentPage}</span>
          <button
            className="hisbuttonnxt"
            disabled={currentPage === Math.ceil(myData.length / itemsPerPage)}
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          >
            Next
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default RoomCards;
