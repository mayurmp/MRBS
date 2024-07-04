import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Avatar,
  FormControl,
  FormControlLabel,
  FormGroup,
  ListItemAvatar,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { MdOutlineChairAlt } from "react-icons/md";
import "../components/DeskBookTable.css";
import ConfirmationModel from "./ConfirmationModel";
import DaysOfWeekSelector from "./DaysOfWeekSelector";
import { postDeskData } from "../../apiUtils/apiFunctions";
import {
  getSaturdayOfPreviousWeek,
  getColorIndex,
  backgroundColors,
  isInCurrentWeek,
} from "../constant/constant";
const ModalComponent = ({
  showModal,
  handleModalClose,
  popupData,
  handleChange,
  selectedUser,
  users,
  reset,
  handleBookingNextWeek,
}) => {
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [message, setMessage] = useState("");
  const [bookPerson, setBookPerson] = useState([]);
  const [duration, setDuration] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  const [repeatOptionValue, setRepeatOptionValue] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [repeatSwitch, setRepeatSwitch] = useState(false);
  const [repeatValue, setRepeatValue] = useState(false);
  const [showDaySelector, setShowDaySelector] = useState(false);

  /* The `handleDayToggle` function toggles the selection of a day in an array based on its current state.*/
  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  /*The function `handleDurationChange` ensures that the input value is between 1 and 24 before updating the duration.*/
  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 24) {
      setDuration(value);
    }
  };

  const isValidDuration = duration >= 1 && duration <= 24;

  const handleCloseModal = () => {
    handleModalClose();
    setRepeatOptionValue("");
    setSelectedDays([]);
    setRepeatSwitch(false);
    setRepeatValue(false);
    setShowDaySelector(false);
    setDuration(1);
  };

  const handleConfirModalClose = () => {
    setConfirmModal(false);
    handleCloseModal();
  };

  /* This `useEffect` hook in React to find a user object from an array of users
 based on a specific condition (`guestName` matching `selectedUser`) and then setting the found user object as the `selectedUserData`.*/
  useEffect(() => {
    const user = users.find((user) => user.guestName === selectedUser);
    setSelectedUserData(user);
  }, [selectedUser, users]);

  const handleSwitchToggle = () => {
    setRepeatSwitch(!repeatSwitch);
    setRepeatValue("false");
  };

  const handleRepeatChange = (event) => {
    setRepeatValue(event.target.value);
  };

  /* The function `handleNextWeekBooking` takes a date as input, calculates the last Saturday of the previous week using the `getSaturdayOfPreviousWeek` function, and then handles booking for the next week based on that date.*/
  const handleNextWeekBooking = (date) => {
    const lastDate = getSaturdayOfPreviousWeek(date);
    handleBookingNextWeek(lastDate);
  };

  /* The function `handleBookDesk` handles booking a desk with optional repeat options and send notifications based on user input.*/
  const handleBookDesk = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      let apiUrl;
      if (isChecked) {
        apiUrl = `/deskbook?notification=on`;
      } else {
        apiUrl = `/deskbook?notification=off`;
      }
      let initialRequestBody;
      if (repeatSwitch) {
        initialRequestBody = {
          DeskName: popupData?.deskName,
          DeskId: popupData?.deskId,
          date: popupData?.date,
          DeskUser: [
            {
              DeskUserName: selectedUserData?.guestName,
              DeskUserEmail: selectedUserData?.guestEmail,
            },
          ],
          Status: "Active",
          repeatOption: repeatOptionValue,
          customDays: selectedDays,
          selectedDurationInWeeks: duration,
        };
      } else {
        initialRequestBody = {
          DeskName: popupData?.deskName,
          DeskId: popupData?.deskId,
          date: popupData?.date,
          DeskUser: [
            {
              DeskUserName: selectedUserData?.guestName,
              DeskUserEmail: selectedUserData?.guestEmail,
            },
          ],
          Status: "Active",
          repeatOption: "null",
        };
      }

      const bookDeskData = await postDeskData(
        apiUrl,
        token,
        initialRequestBody
      );
      setMessage(bookDeskData?.data?.message);
      setBookPerson(popupData);
      handleCloseModal();
      setConfirmModal(true);
      if (isInCurrentWeek(popupData?.date)) {
        reset();
      } else {
        handleNextWeekBooking(popupData?.date);
      }
    } catch (error) {
      setConfirmModal(true);
      setMessage(error.response?.data?.message);
      setBookPerson(popupData);
    }
    setRepeatSwitch(false);
    setShowDaySelector(false);
    setIsChecked(false);
  };

  const handledaySelector = () => {
    setRepeatOptionValue("customDays");
    setShowDaySelector(true);
  };

  /* The function `handleSelector` updates selected days and repeat option value based on the selected value and hides the day selector.*/
  const handleSelector = (selectedValue) => {
    setSelectedDays([...selectedDays, popupData.day]);

    if (selectedValue === 1) {
      setRepeatOptionValue("everyDay");
    } else if (selectedValue === 2) {
      setRepeatOptionValue("every2ndDay");
    }
    setShowDaySelector(false);
  };

  return (
    <div>
      {!confirmModal && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Customize booking </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="main">
              <div className="location">
                <span>
                  <MdOutlineChairAlt
                    style={{
                      height: "30px",
                      width: "30px",
                      marginLeft: "10px",
                      color: "orange",
                    }}
                  />
                  <span className="booktitle">
                    {" "}
                    <b>{popupData.deskName}</b> at <b>London</b> location on{" "}
                    <b>{popupData.date}</b>
                  </span>
                </span>
              </div>
              <div className="bookname">
                <span className="booktitle">Book For</span>
              </div>
              <div className="multi">
                <FormControl className="multi">
                  <Select
                    id="demo-simple-select"
                    value={selectedUser}
                    onChange={handleChange}
                    displayEmpty
                    renderValue={(selected) => (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {selected && (
                          <>
                            <ListItemAvatar>
                              <Avatar
                                alt={selected}
                                src={
                                  users.find(
                                    (user) => user.guestName === selected
                                  )?.avatar
                                }
                                style={{
                                  backgroundColor:
                                    backgroundColors[
                                      getColorIndex(selected[0].toUpperCase()) // Get color index based on the first character
                                    ],
                                }}
                              />
                            </ListItemAvatar>
                            <div>
                              <div>{selected}</div>
                              <div>
                                {
                                  users.find(
                                    (user) => user.guestName === selected
                                  )?.email
                                }
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    // Add scrolling functionality after 8 guests
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 8 * 48,
                          width: 250,
                          overflowY: "auto",
                        },
                      },
                    }}
                  >
                    {users?.map((user) => (
                      <MenuItem key={user.guestName} value={user.guestName}>
                        <ListItemAvatar>
                          <Avatar
                            alt={user.guestName}
                            src={user.avatar}
                            style={{
                              backgroundColor:
                                backgroundColors[
                                  getColorIndex(user.guestName[0].toUpperCase()) // Get color index based on the first character
                                ],
                            }}
                          />
                        </ListItemAvatar>
                        {user.guestName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div>
                  <div className="repeat">
                    <span
                      className="booktitle"
                      style={{ marginTop: "8px", marginRight: "2px" }}
                    >
                      Repeat
                    </span>
                    <span style={{ marginLeft: "10px" }}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              // className="square-switch"
                              checked={repeatSwitch}
                              onChange={handleSwitchToggle}
                            />
                          }
                        />
                      </FormGroup>
                    </span>
                    {repeatSwitch && (
                      <span>
                        <FormControl className="repeateValueSelector">
                          <Select
                            value={repeatValue}
                            onChange={handleRepeatChange}
                            placeholder="Choose an option"
                          >
                            <MenuItem value="false" disabled>
                              Choose an option
                            </MenuItem>
                            <MenuItem
                              value={1}
                              onClick={() => handleSelector(1)}
                            >
                              Every {popupData.day}
                            </MenuItem>
                            <MenuItem
                              value={2}
                              onClick={() => handleSelector(2)}
                            >
                              Every 2nd {popupData.day}
                            </MenuItem>
                            <MenuItem value={3} onClick={handledaySelector}>
                              Custom
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </span>
                    )}
                  </div>
                  {repeatSwitch && showDaySelector && (
                    <div
                      className="repeat"
                      style={{ marginTop: "2rem", marginBottom: "1rem" }}
                    >
                      <span className="booktitle" style={{ marginTop: "5px" }}>
                        Every:
                      </span>
                      <DaysOfWeekSelector
                        selectedDate={popupData.date}
                        duration={duration}
                        selectedDays={selectedDays}
                        handleDayToggle={handleDayToggle}
                      />
                    </div>
                  )}
                  {repeatSwitch && (
                    <div
                      className={`repeat-weeks ${
                        !isValidDuration ? "invalid-duration" : ""
                      }`}
                    >
                      <span className="booktitle" style={{ marginTop: "5px" }}>
                        Duration:
                      </span>
                      <input
                        type="number"
                        className={`me-1 weekinput ${
                          !isValidDuration ? "invalid-input" : ""
                        }`}
                        style={{
                          width: "40px",
                          margin: "2px",
                          borderColor: !isValidDuration ? "red" : "",
                        }}
                        aria-label="..."
                        value={duration}
                        onChange={handleDurationChange}
                      />{" "}
                      weeks
                      <div className="important-point-container">
                        <span className="info-icon">
                          <FontAwesomeIcon icon={faInfoCircle} />
                          <span className="info-tooltip">Min:1 and Max:24</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="repeat">
                  <input
                    className="form-check-input me-1"
                    type="checkbox"
                    value=""
                    aria-label="..."
                    disabled
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <span>send booking notification</span>
                  <div className="important-point-container">
                    <span className="info-icon">
                      <FontAwesomeIcon icon={faInfoCircle} />
                      <span className="info-tooltip">
                        User will receive email notification
                      </span>
                    </span>
                  </div>
                </div>

                <div className="button">
                  <button
                    type="button"
                    className="btn btn-secondary booktitle"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary booktitle"
                    style={{ marginLeft: "1rem" }}
                    onClick={handleBookDesk}
                    disabled={
                      !selectedUser ||
                      (repeatSwitch && repeatValue === "false") ||
                      (showDaySelector && selectedDays.length === 0)
                    }
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
      <ConfirmationModel
        showModal={confirmModal}
        handleModalClose={handleConfirModalClose}
        message={message}
        bookPerson={bookPerson}
      />
    </div>
  );
};

export default ModalComponent;
