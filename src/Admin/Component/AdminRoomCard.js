import React, { useState, useEffect } from "react";
import RoomCardMain from "./RoomCardMain";
import Loading from "../../Pages/Components/Loading/Loading";
import Notdata from "../../Pages/Components/Loading/Notdata";
import "./AdminRoomCards.css";
import { fetchData } from "../../apiUtils/apiFunctions";
const AdminRoomCard = () => {
  const [loading, setLoading] = useState(true);
  const [myData, setMyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = myData.slice(indexOfFirstItem, indexOfLastItem);

  const getApiData = async () => {
    try {
      const token = sessionStorage.getItem("Admin");
      const url = `/meetrooms`;
      const meetRoomsRes = await fetchData(url, token);
      setMyData(meetRoomsRes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  const onUpdate = () => {
    getApiData();
  };
  useEffect(() => {
    getApiData();
  }, []);

  return (
    <>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <>
            {myData.length === 0 ? (
              <Notdata error="Rooms Not Found" />
            ) : (
              <div className="RoomCardCards_admin">
                {currentItems.map((item) => {
                  return (
                    <div key={item.id}>
                      <RoomCardMain
                        id={item.id}
                        Rname={item.meetRoomName}
                        img={item.imageUrl}
                        inside={item.capacity}
                        status={item.status}
                        path={`/meetrooms/${item.id}`}
                        onUpdate={onUpdate}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {myData.length > 8 ? (
        <div className="hispagination_admin">
          <button
            className="hisbuttonpre_admin"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
          >
            Previous
          </button>
          <span>{currentPage}</span>
          <button
            className="hisbuttonnxt_admin"
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

export default AdminRoomCard;
