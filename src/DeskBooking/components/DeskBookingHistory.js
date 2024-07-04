import { Avatar, Card } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect, useState, useCallback } from "react";
import "../components/DeskBookTable.css";
import { postData, fetchData } from "../../apiUtils/apiFunctions";
import Nav from "../../Pages/Components/Nav/Nav";
import { backgroundColors } from "../constant/constant";
export default function DeskBookingHistory() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [todaysBookings, setTodaysBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
  const [currentPagePast, setCurrentPagePast] = useState(1);
  const [lastUpcomingBooking, setLastUpcomingBooking] = useState(false);
  const [lastPastBooking, setLastPastBooking] = useState(false);

  const isAdmin = sessionStorage.getItem("deskad");
  const currentPageTodays = 1;
  const itemsPerPage = 5;

  /* The function `fetchTodaysBookings` fetches today's bookings data.*/
  const fetchTodaysBookings = async () => {
    try {
      const url = `/deskbook?filter=today&pageno=${currentPageTodays}&perpage=${itemsPerPage}`;
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await fetchData(url, token);
      setTodaysBookings(response?.DeskBookings);
    } catch (error) {}
  };

  /* This `useEffect` hook responsible for fetching today's bookings data.*/
  useEffect(() => {
    fetchTodaysBookings();
  }, []);

  /* The function `fetchUpcomingBookings` fetches today's bookings data.*/
  const fetchUpcomingBookings = useCallback(async () => {
    try {
      const url = `/deskbook?filter=upcoming&pageno=${currentPageUpcoming}&perpage=${itemsPerPage}`;
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await fetchData(url, token);
      // Check if any booking has LastBooking set to true
      const hasLastUpcomingBooking = response?.DeskBookings.some(
        (booking) => booking.LastBooking === true
      );
      if (hasLastUpcomingBooking) {
        setLastUpcomingBooking(true);
      }
      setUpcomingBookings(response?.DeskBookings);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
    }
  }, [currentPageUpcoming, setUpcomingBookings]);

  /* This `useEffect` hook responsible for fetching upcoming bookings data.*/
  useEffect(() => {
    fetchUpcomingBookings();
  }, [fetchUpcomingBookings]);

  /* This `useEffect` hook is responsible for fetching past desk bookings based on the current page number . */
  useEffect(() => {
    const fetchPastBookings = async () => {
      try {
        const url = `/deskbook?filter=past&pageno=${currentPagePast}&perpage=${itemsPerPage}`;
        const token = JSON.parse(sessionStorage.getItem("token"));
        const response = await fetchData(url, token);
        const reversedBookings = response?.DeskBookings.reverse();
        // Check if any booking has LastBooking set to true
        const hasLastPastBooking = response?.DeskBookings.some(
          (booking) => booking.LastBooking === true
        );
        if (hasLastPastBooking) {
          setLastPastBooking(true);
        }
        setPastBookings(reversedBookings);
      } catch (error) {
        console.error("Error fetching past bookings:", error);
      }
    };

    fetchPastBookings();
  }, [currentPagePast, lastPastBooking]);

  const handleNextPageUpcoming = () => {
    setCurrentPageUpcoming((prevPage) => prevPage + 1);
  };

  const handlePreviousPageUpcoming = () => {
    if (currentPageUpcoming > 1) {
      setCurrentPageUpcoming((prevPage) => prevPage - 1);
      setLastUpcomingBooking(false);
    }
  };
  const handleNextPagePast = () => {
    setCurrentPagePast((prevPage) => prevPage + 1);
  };

  const handlePreviousPagePast = () => {
    if (currentPagePast > 1) {
      setCurrentPagePast((prevPage) => prevPage - 1);
      setLastPastBooking(false);
    }
  };

  /* The function `deletebooking` is deletes a today's and upcoming bookings. */
  const deletebooking = async (userData, bookingType) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const url = "/deskbookdelete";
      const initialRequestBody = {
        DeskName: userData?.deskName,
        date: userData?.date,
      };
      await postData(url, initialRequestBody, token);
      if (bookingType === "today") {
        fetchTodaysBookings();
      } else if (bookingType === "upcoming") {
        fetchUpcomingBookings();
      }
    } catch (error) {}
  };

  return (
    <div className="App">
      <Nav isDeskBookingUser={!isAdmin} isDeskBookingAdmin={isAdmin} />
      <Card className="bookingpage">
        <h4 className="todaysheading">Today's Desk Booking</h4>{" "}
        {todaysBookings?.length > 0 ? (
          <h6 className="todaysSubheading">View your Today's Booking</h6>
        ) : (
          <h6 className="todaysSubheading">You have no Today's Booking</h6>
        )}
        {todaysBookings?.map((data, index) => (
          <div className="todaysbooking" key={data?.Id}>
            <div className="daydatebooking" style={{ margin: "10px" }}>
              <h5>{data?.date} </h5>
              <h5>{data?.Day}</h5>
            </div>
            <div
              className="tesk-row"
              style={{ margin: "10px", alignItems: "baseline" }}
            >
              <Avatar
                alt={data?.DeskName}
                src={data?.DeskName}
                style={{
                  marginLeft: "4px",
                  margin: "10px",
                  backgroundColor:
                    backgroundColors[index % backgroundColors?.length],
                }}
              >
                {data?.DeskName.substring(0, 1).toUpperCase()}
              </Avatar>
              <h6 className="desknameStyle">{data?.DeskName}</h6>
            </div>
            <div className="deskCancelButton">
              <Button
                variant="outlined"
                onClick={() =>
                  deletebooking(
                    {
                      date: data?.date,
                      deskName: data?.DeskName,
                      deskId: data?.Id,
                      id: null,
                    },
                    "today"
                  )
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </Card>
      <Card className="bookingpage">
        <h4 className="todaysheading">Upcoming Desk Bookings</h4>
        {upcomingBookings?.length > 0 ? (
          <h6 className="todaysSubheading">View your Upcoming Bookings</h6>
        ) : (
          <h6 className="todaysSubheading">You have no Upcoming Bookings</h6>
        )}
        {upcomingBookings?.map((data, index) => (
          <>
            <div className="todaysbooking" key={data?.Id}>
              <div className="daydatebooking" style={{ margin: "10px" }}>
                <h5>{data?.date}</h5>
                <h5>{data?.Day}</h5>
              </div>
              <div
                className="tesk-row"
                style={{ margin: "10px", alignItems: "baseline" }}
              >
                <Avatar
                  alt={data?.DeskName}
                  src={data?.DeskName}
                  style={{
                    marginLeft: "4px",
                    margin: "10px",
                    backgroundColor:
                      backgroundColors[index % backgroundColors?.length],
                  }}
                >
                  {data?.DeskName?.substring(0, 1).toUpperCase()}
                </Avatar>
                <h6 className="desknameStyle">{data?.DeskName}</h6>
              </div>
              <div className="deskCancelButton">
                <Button
                  variant="outlined"
                  onClick={() =>
                    deletebooking(
                      {
                        date: data?.date,
                        deskName: data?.DeskName,
                        deskId: data?.Id,
                        id: null,
                      },
                      "upcoming"
                    )
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
            <hr className="custom-hr" />
          </>
        ))}
        <div className="pagination">
          <button
            className="pagination-pre-button"
            onClick={handlePreviousPageUpcoming}
            disabled={currentPageUpcoming === 1}
            style={{ opacity: currentPageUpcoming === 1 ? 0.7 : 1 }}
          >
            Prev
          </button>
          <span>{currentPageUpcoming}</span>
          <button
            className="pagination-next-button"
            onClick={handleNextPageUpcoming}
            disabled={
              upcomingBookings?.length < itemsPerPage || lastUpcomingBooking
            }
            style={{
              opacity:
                upcomingBookings?.length < itemsPerPage || lastUpcomingBooking
                  ? 0.7
                  : 1,
            }}
          >
            Next
          </button>
        </div>
      </Card>
      <Card className="bookingpage">
        <h4 className="todaysheading">Past Desk Bookings</h4>
        {pastBookings?.length > 0 ? (
          <h6 className="todaysSubheading">View Past Bookings</h6>
        ) : (
          <h6 className="todaysSubheading">No Past Bookings</h6>
        )}
        {pastBookings?.map((data, index) => (
          <>
            <div className="pastbooking" key={data?.Id}>
              <div className="daydatebooking" style={{ margin: "10px" }}>
                <h5>{data?.date}</h5>
                <h5>{data?.Day}</h5>
              </div>
              <div
                className="tesk-row"
                style={{ margin: "10px", alignItems: "baseline" }}
              >
                <Avatar
                  alt={data?.DeskName}
                  src={data?.DeskName}
                  style={{
                    marginLeft: "4px",
                    margin: "10px",
                    backgroundColor:
                      backgroundColors[index % backgroundColors?.length],
                  }}
                >
                  {data?.DeskName?.substring(0, 1).toUpperCase()}
                </Avatar>
                <h6 className="desknameStyle">{data?.DeskName}</h6>
              </div>{" "}
              <div className="bookedBy">
                <h6>Booked By:</h6>
                <h6>{data?.BookedBy}</h6>
              </div>
            </div>
            <hr className="custom-hr" />
          </>
        ))}
        <div className="pagination">
          <button
            className="pagination-pre-button"
            onClick={handlePreviousPagePast}
            disabled={currentPagePast === 1}
            style={{ opacity: currentPagePast === 1 ? 0.7 : 1 }}
          >
            Prev
          </button>
          <span>{currentPagePast}</span>
          <button
            className="pagination-next-button"
            onClick={handleNextPagePast}
            disabled={pastBookings?.length < itemsPerPage || lastPastBooking}
            style={{
              opacity:
                pastBookings?.length < itemsPerPage || lastPastBooking
                  ? 0.7
                  : 1,
            }}
          >
            Next
          </button>
        </div>
      </Card>
    </div>
  );
}
