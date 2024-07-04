import { React, useState, useEffect } from "react";
import "../RoomCard.css";
import Loading from "../../Loading/Loading";
import { fetchData } from "../../../../apiUtils/apiFunctions";

function RoomDetailsCard({ img, name, capacity }) {
  return (
    <div className="roomcard">
      <div className="roomimg">
        <img className="meetingRoom" src={img} alt="img" />
      </div>
      <div className="roomdetails">
        <div>
          <h1 className="roomcardName truncate-text ">{name}</h1>
          <p className="capacity1" style={{ marginBottom: "0px" }}>
            capacity: <span>{capacity}</span> People
          </p>
        </div>
      </div>
    </div>
  );
}

const RoomCardCards = () => {
  const [loading, setLoading] = useState(true);
  const [myData, setMyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = myData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const getApiData = async () => {
      const url = "/meetrooms";
      const token = JSON.parse(sessionStorage.getItem("token"));
      const meetRoomsRes = await fetchData(url, token);
      setMyData(meetRoomsRes);
      setLoading(false);
    };
    getApiData();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="RoomCardCards">
            {currentItems.map((item) => {
              return (
                <RoomDetailsCard
                  key={item.id}
                  id={item.id}
                  name={item.meetRoomName}
                  img={item.imageUrl}
                  capacity={item.capacity}
                  data={item.imageUrl}
                />
              );
            })}
          </div>

          {myData.length > 8 && (
            <div className="hispagination">
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
                disabled={
                  currentPage === Math.ceil(myData.length / itemsPerPage)
                }
                onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomCardCards;
