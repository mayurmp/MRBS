import { Avatar } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { GuestListContext } from "../../context/GuestListContext";
import { Button, Modal } from "react-bootstrap";
import { RiArrowDropDownLine } from "react-icons/ri";
import "./DeskBookTable.css";
import ModalComponent from "./ModalComponent";
import TableHeader from "./TableHeader";
import { fetchData, postData, deleteData } from "../../apiUtils/apiFunctions";
import {
  getSaturdayOfPreviousWeek,
  getColorIndex,
  backgroundColors,
  isDateInPast,
  isInCurrentWeek,
} from "../constant/constant";
import Loading from "../../Pages/Components/Loading/Loading";
import Notdata from "../../Pages/Components/Loading/Notdata";
import AddNewDesk from "./AddNewDesk";
function DeskBookTable({
  isAdmin,
  currentWeekData,
  currentWeekLoading,
  currentWeekNoData,
}) {
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [selectedUser, setSelectedUser] = React.useState("");
  const [bookingInfo, setBookingInfo] = useState(null);
  const [hoverEffect, setHoverEffect] = useState(false);
  const [editDeskPopup, setEditDeskPopup] = useState(false);
  const [deskNamePop, setDeskNamePop] = useState({});
  const [popupData, setPopupData] = useState({
    date: "",
    deskName: "",
    deskId: "",
  });
  const guestList = useContext(GuestListContext);
  const storedUsername = sessionStorage.getItem("userName");
  const storedLastname = sessionStorage.getItem("lastname");
  const ticket = Number(sessionStorage.getItem("userId"));

  /* This `useEffect` hook update the state variables `data`,`loading`, and `noData` based on the values of `currentWeekData` `currentWeekLoading`, and `currentWeekNoData` */

  useEffect(() => {
    setData(currentWeekData);
    setLoading(currentWeekLoading);
    setNoData(currentWeekNoData);
  }, [currentWeekData, currentWeekLoading, currentWeekNoData]);

  /* This useEffect to set the user state to the value of the guestList array whenever the guestList array changes.*/
  useEffect(() => {
    setUser(guestList);
  }, [guestList]);

  /* This `useEffect` concatenate the `storedUsername` and `storedLastname` variables and store the result in the `selectedUser` state variable.*/
  useEffect(() => {
    const concatenatedName = `${storedUsername} ${storedLastname}`;
    setSelectedUser(concatenatedName);
  }, [storedLastname, storedUsername]);

  /* The function `handleCurrentWeekData` fetches current week desk data from an API endpoint for desk bookings and updates the state accordingly.*/
  const handleCurrentWeekData = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const url = "/week";
      const allDeskBookings = await fetchData(url, token);
      setLoading(false);
      setData(allDeskBookings);
    } catch (error) {
      setLoading(false);
      setNoData(true);
    }
  };

  /* This `useEffect` hook run a function `handleCurrentWeekData` when the `isAdmin` variable changes. If `isAdmin` is false, the `handleCurrentWeekData` function will be called. */
  useEffect(() => {
    if (!isAdmin) {
      handleCurrentWeekData();
    }
  }, [isAdmin]);

  /* The function `handleNextWeekData` handle fetching data for the next weeks*/
  const handleNextWeekData = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const url = "/week?direction=next";
      const lastDate = data[data.length - 1]?.date;
      const initialRequestBody = { date: lastDate };
      const nextWeekData = await postData(url, initialRequestBody, token);
      setLoading(false);
      setData(nextWeekData);
    } catch (error) {
      setLoading(false);
      setNoData(true);
    }
  };

  /* The function `handlePrevWeekData` handle fetching data for the previous weeks*/
  const handlePrevWeekData = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const url = "/week?direction=pre";
      const firstDate = data[0]?.date;
      const initialRequestBody = { date: firstDate };
      const preWeekData = await postData(url, initialRequestBody, token);
      setLoading(false);
      setData(preWeekData);
    } catch (error) {
      setLoading(false);
      setNoData(true);
    }
  };

  /* The function `handleBookingNextWeek` fetches data for the next week based on a given date and updates the UI accordingly.*/
  const handleBookingNextWeek = async (date) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const url = "/week?direction=next";
      const initialRequestBody = { date: date };
      const nextWeekData = await postData(url, initialRequestBody, token);
      setData(nextWeekData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setNoData(true);
    }
  };

  /* The function `handleDeleteThisBooking` deletes a booking if the date is not in the past*/
  const handleDeleteThisBooking = async (info) => {
    if (!isDateInPast(info.date)) {
      try {
        const token = JSON.parse(sessionStorage.getItem("token"));
        const url = "/deskbookdelete";
        const initialRequestBody = {
          DeskName: info.deskName,
          date: info.date,
        };

        const deletedDesk = await postData(url, initialRequestBody, token);

        handleClose();
        if (isInCurrentWeek(deletedDesk?.date)) {
          handleCurrentWeekData();
        } else {
          handleNextWeekBooking(deletedDesk?.date);
        }
      } catch (error) {}
    }
  };

  /* The function `handleDeleteAllBookings` deletes all bookings for a specific date if it is not in the past.*/
  const handleDeleteAllBookings = async (info) => {
    if (!isDateInPast(info.date)) {
      try {
        const token = JSON.parse(sessionStorage.getItem("token"));
        const url = "/alldeskbookdelete";
        await deleteData(url, token);
        handleClose();
        if (isInCurrentWeek(info?.date)) {
          handleCurrentWeekData();
        } else {
          handleNextWeekBooking(info?.date);
        }
      } catch (error) {}
    }
  };

  /* The `handleOpen` function checks if a given date is in the past and sets popup data accordingly.*/
  const handleOpen = (userData) => {
    if (!isDateInPast(userData?.date)) {
      setPopupData({
        date: userData.date,
        deskName: userData.deskName,
        deskId: userData.deskId,
        day: userData.day,
      });
      setShowModal(true);
    }
  };

  /* The function `handleNextWeekBooking` takes a date as input, calculates the last Saturday of the previous week using the `getSaturdayOfPreviousWeek` function, and then handles booking for the next week based on that date.*/
  const handleNextWeekBooking = (date) => {
    const lastDate = getSaturdayOfPreviousWeek(date);
    handleBookingNextWeek(lastDate);
  };

  /* The function `handleDeleteShow` checks if the user is authorized to delete a booking and either displays a confirmation dialog or directly deletes the booking.*/
  const handleDeleteShow = (dayData, user) => {
    const concatenatedName = `${storedUsername} ${storedLastname}`;
    const info = {
      date: dayData,
      deskName: user?.DeskName,
    };
    if (
      user?.DeskUser?.DeskUserName === concatenatedName &&
      user?.repeatOption !== "null"
    ) {
      setBookingInfo(info);
      setShow(true);
    } else {
      setBookingInfo(info);
      handleDeleteThisBooking(info);
    }
  };

  const handleOpenEditDesk = (DeskData) => {
    setDeskNamePop(DeskData);
    setEditDeskPopup(true);
  };

  const handleCloseEditDesk = () => {
    setEditDeskPopup(false);
  };

  const handleClose = () => setShow(false);

  const handleChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  /* The function `handleAvatarHover` checks if the user's `UserId` matches a `ticket` and sets a hover effect accordingly.*/
  const handleAvatarHover = (user) => {
    const concatenatedName = `${storedUsername} ${storedLastname}`;
    if (user?.DeskUser) {
      const userId = user.UserId;
      if (userId === ticket) {
        setHoverEffect(true);
      } else if (user?.DeskUser?.DeskUserName === concatenatedName) {
        setHoverEffect(true);
      } else {
        setHoverEffect(false);
      }
    }
  };

  /* The function `handleMouseOut` removes the "avatar-hover" class from the element with the class "avatar-container" when the mouse moves out of it.*/
  const handleMouseOut = () => {
    const avatarContainer = document.querySelector(".avatar-container");
    if (avatarContainer) {
      avatarContainer.classList.remove("avatar-hover");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (noData) {
    return <Notdata error="Desks Not Found" />;
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table">
        <TableHeader
          dates={data}
          handleNextData={handleNextWeekData}
          handlePrevData={handlePrevWeekData}
        />
        <tbody>
          {data &&
            data?.length > 0 &&
            data[0]?.desks &&
            data[0]?.desks.length > 0 &&
            data[0]?.desks.map((desk, index) => (
              <tr key={desk?.Id}>
                <td>
                  <div
                    className="tesk-row"
                    style={{ cursor: isAdmin ? "pointer" : "" }}
                    onClick={
                      isAdmin
                        ? () =>
                            handleOpenEditDesk({
                              Id: desk?.Id,
                              deskName: desk?.DeskName,
                              deskNumber: index + 1,
                            })
                        : undefined
                    }
                  >
                    <Avatar
                      alt={desk?.DeskName}
                      src={desk?.logo}
                      style={{
                        marginLeft: "4px",
                        margin: "10px",
                        backgroundColor:
                          backgroundColors[index % backgroundColors.length],
                      }}
                    >
                      {desk?.DeskName[0].toUpperCase()}
                    </Avatar>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="desknameStyle">{desk?.DeskName}</span>{" "}
                        <span className="desktypestyle">
                          {desk?.DeskType === "Dedicated Desk"
                            ? "Dedicated"
                            : "Hot Desk"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          backgroundColor: "#f2f2f2",
                          color: "#33333",
                          padding: "5px 10px",
                          marginLeft: "10px",
                          borderRadius: "5px",
                        }}
                      >
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </td>
                {data?.map((dayData) => {
                  const matchingDesk = dayData?.desks?.find(
                    (d) => d.DeskName === desk?.DeskName
                  );
                  const isDeskDedicated =
                    matchingDesk && matchingDesk?.DeskType === "Dedicated Desk";
                  return (
                    <td key={`${dayData?.date}-${desk?.DeskName}`}>
                      {isDeskDedicated ? (
                        <>
                          {matchingDesk && matchingDesk?.DeskUser.length > 0 ? (
                            matchingDesk?.DeskUser.map((user) => (
                              <div
                                className={
                                  isDateInPast(dayData?.date)
                                    ? "disable-tesk-row1"
                                    : "tesk-row1"
                                }
                                key={`${dayData?.date}-${desk?.DeskName}-${user?.DeskUserName}`}
                                style={{ cursor: "pointer" }}
                              >
                                <div
                                  className={`userdetails ${
                                    isDateInPast(dayData?.date) && "disable"
                                  }
                            `}
                                >
                                  <div className="usernameStyle">
                                    <p>{user?.DeskUser?.DeskUserName}</p>
                                  </div>
                                  <div
                                    className={
                                      hoverEffect && isAdmin
                                        ? "avatar-container"
                                        : ""
                                    }
                                    style={{ position: "relative" }}
                                    onMouseOver={() => {
                                      if (!isDateInPast(dayData?.date)) {
                                        handleAvatarHover(user);
                                      }
                                    }}
                                    onMouseOut={() => {
                                      if (!isDateInPast(dayData?.date)) {
                                        handleMouseOut();
                                      }
                                    }}
                                  >
                                    {" "}
                                    <Avatar
                                      src={user.DeskUserEmail}
                                      style={{
                                        marginLeft: "4px",
                                        margin: "3px",
                                        backgroundColor:
                                          backgroundColors[
                                            getColorIndex(
                                              user.DeskUser.DeskUserName[0].toUpperCase()
                                            )
                                          ],
                                      }}
                                    >
                                      {user.DeskUser.DeskUserName
                                        ? user.DeskUser.DeskUserName[0].toUpperCase()
                                        : ""}
                                    </Avatar>
                                    <div
                                      className={
                                        isDateInPast(dayData?.date)
                                          ? "disable close-icon"
                                          : "close-icon"
                                      }
                                      onClick={() => {
                                        if (!isDateInPast(dayData?.date)) {
                                          handleDeleteShow(dayData?.date, user);
                                        }
                                      }}
                                      disabled={
                                        isDateInPast(dayData?.date) && !isAdmin
                                      }
                                    >
                                      &#10006;
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div
                              className={
                                isDateInPast(dayData?.date)
                                  ? "disable-book"
                                  : "book"
                              }
                            >
                              <span
                                style={{
                                  alignItems: "center",
                                  cursor: !isDateInPast(dayData?.date)
                                    ? "pointer"
                                    : "default",
                                }}
                                className={
                                  isDateInPast(dayData?.date) && "disable"
                                }
                                onClick={() => {
                                  if (isAdmin && !isDateInPast(dayData?.date)) {
                                    handleOpen({
                                      date: dayData.date,
                                      deskName: desk.DeskName,
                                      deskId: desk.Id,
                                      day: dayData.day,
                                      id: null,
                                    });
                                  }
                                }}
                              >
                                <p className="booknameStyle">
                                  Book{"    "}
                                  <RiArrowDropDownLine size={30} />
                                </p>
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {matchingDesk &&
                          matchingDesk?.DeskUser?.length > 0 ? (
                            matchingDesk?.DeskUser.map((user) => (
                              <div
                                className={
                                  isDateInPast(dayData?.date)
                                    ? "disable-tesk-row1"
                                    : "tesk-row1"
                                }
                                key={`${dayData?.date}-${desk?.DeskName}-${user?.DeskUserName}`}
                                style={{ cursor: "pointer" }}
                              >
                                <div
                                  className={`userdetails ${
                                    isDateInPast(dayData?.date) && "disable"
                                  }
                              `}
                                >
                                  <div className="usernameStyle">
                                    <p>{user?.DeskUser?.DeskUserName}</p>
                                  </div>
                                  <div
                                    className={`${
                                      hoverEffect ? "avatar-container" : ""
                                    }`}
                                    style={{ position: "relative" }}
                                    onMouseOver={() => {
                                      if (!isDateInPast(dayData?.date)) {
                                        handleAvatarHover(user);
                                      }
                                    }}
                                    onMouseOut={() => {
                                      if (!isDateInPast(dayData?.date)) {
                                        handleMouseOut();
                                      }
                                    }}
                                  >
                                    {" "}
                                    <Avatar
                                      src={user?.DeskUserEmail}
                                      style={{
                                        marginLeft: "4px",
                                        margin: "3px",
                                        backgroundColor:
                                          backgroundColors[
                                            getColorIndex(
                                              user?.DeskUser?.DeskUserName[0].toUpperCase()
                                            )
                                          ],
                                      }}
                                    >
                                      {user?.DeskUser?.DeskUserName
                                        ? user?.DeskUser?.DeskUserName[0].toUpperCase()
                                        : ""}
                                    </Avatar>
                                    <div
                                      className={
                                        isDateInPast(dayData?.date)
                                          ? "disable close-icon"
                                          : "close-icon"
                                      }
                                      onClick={() => {
                                        if (!isDateInPast(dayData?.date)) {
                                          handleDeleteShow(dayData?.date, user);
                                        }
                                      }}
                                      disabled={isDateInPast(dayData?.date)}
                                    >
                                      &#10006;
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div
                              className={
                                isDateInPast(dayData?.date)
                                  ? "disable-book"
                                  : "book"
                              }
                            >
                              <span
                                style={{ alignItems: "center" }}
                                className={
                                  isDateInPast(dayData?.date) ? "disable" : ""
                                }
                                onClick={() =>
                                  handleOpen({
                                    date: dayData.date,
                                    deskName: desk.DeskName,
                                    deskId: desk.Id,
                                    day: dayData.day,
                                    id: null,
                                  })
                                }
                                disabled={isDateInPast(dayData?.date)}
                              >
                                <p className="booknameStyle">
                                  Book{"    "}
                                  <RiArrowDropDownLine size={30} />
                                </p>
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  );
                })}
                <td>
                  {" "}
                  <div className="empty-row"></div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <ModalComponent
        showModal={showModal}
        handleModalClose={handleModalClose}
        popupData={popupData}
        handleChange={handleChange}
        selectedUser={selectedUser}
        users={user}
        reset={handleCurrentWeekData}
        handleBookingNextWeek={handleBookingNextWeek}
      />{" "}
      <AddNewDesk
        reset={handleCurrentWeekData}
        isEdit={true}
        deskData={deskNamePop}
        isOpen={editDeskPopup}
        isClose={handleCloseEditDesk}
      />
      <Modal show={show} onHide={handleClose} style={{ marginTop: "50px" }}>
        <Modal.Header closeButton>
          <Modal.Title className="modalComponent">
            Delete this booking and future bookings?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            className="deleteAllModel"
            variant="danger"
            onClick={() => handleDeleteThisBooking(bookingInfo)}
            style={{
              backgroundColor: "orange",
              color: "white",
              borderRadius: "10px",
            }}
          >
            This Booking
          </Button>

          <Button
            className="deleteAllModel"
            variant="success"
            onClick={() => handleDeleteAllBookings(bookingInfo)}
            style={{
              backgroundColor: "orange",
              color: "white",
              borderRadius: "10px",
            }}
          >
            All Bookings
          </Button>
          <Button
            className="deleteAllModel"
            variant="light"
            onClick={handleCancel}
            style={{
              backgroundColor: "white",
              color: "black",
              borderRadius: "10px",
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default DeskBookTable;
