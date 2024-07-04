import React, { useEffect, useState } from "react";
import Nav from "../../Pages/Components/Nav/Nav";
import "../../Pages/Components/Nav/Nav.css";
import DeskBookTable from "../components/DeskBookTable";
import { fetchData } from "../../apiUtils/apiFunctions";

export default function AdminIndex() {
  const [currentWeekData, setCurrentWeekData] = useState([]);
  const [currentWeekLoading, setCurrentWeekLoading] = useState(true);
  const [currentWeekNoData, setCurrentWeekNoData] = useState(false);

  /* The function `handleCurrentWeekData` fetches desk booking data for the current week and updates the state accordingly.*/
  const handleCurrentWeekData = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const url = "/week";
      const allDeskBookings = await fetchData(url, token);
      setCurrentWeekLoading(false);
      setCurrentWeekData(allDeskBookings);
    } catch (error) {
      setCurrentWeekLoading(false);
      setCurrentWeekNoData(true);
    }
  };

  /* This `useEffect` hook is calling the `handleCurrentWeekData` function */
  useEffect(() => {
    handleCurrentWeekData();
  }, []);

  return (
    <>
      <div className="stickyClass">
        <Nav
          isDeskBookingAdmin={true}
          handleCurrentWeekData={handleCurrentWeekData}
        />
      </div>
      <div className="deskbooktable">
        <DeskBookTable
          isAdmin={true}
          currentWeekData={currentWeekData}
          currentWeekLoading={currentWeekLoading}
          currentWeekNoData={currentWeekNoData}
        />
      </div>
    </>
  );
}
