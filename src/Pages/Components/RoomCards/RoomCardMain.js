import React, { useEffect, useState, useContext } from "react";
import "./RoomCard.css";
import { AiOutlineClockCircle } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import Multiselect from "multiselect-react-dropdown";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { GrClose } from "react-icons/gr";
import Notdata from "../Loading/Notdata";
import Nav from "../Nav/Nav";
import { GuestListContext } from "../../../context/GuestListContext";
import { postData } from "../../../apiUtils/apiFunctions";
function RoomCardMain(props) {
  const [viewBookingModalShow, setViewBookingModalShow] = useState(false);

  const handleCloseViewBookingModal = () => {
    setViewBookingModalShow(false);
  };

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [modalShowUn, setModalShowUn] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalVariant, setModalVariant] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [dates, setDates] = useState(new Date().toISOString().split("T")[0]);
  const [cardData, setCardData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [noData, setNoData] = useState(false);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const guestList = useContext(GuestListContext);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const MeetRoomID = props.id;
  useEffect(() => {
    const formattedOptions = guestList.map((guest) => ({
      guestName: guest.guestName,
      guestEmail: guest.guestEmail,
    }));
    setSuggestions(formattedOptions);
  }, [guestList]);
  useEffect(() => {
    const fetchData = async () => {
      if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
        const formattedDate = selectedDate.toLocaleDateString("en-GB");
        const formDate = {
          meetRoomId: MeetRoomID,
          date: formattedDate,
        };

        const requestData = JSON.stringify(formDate);
        try {
          const url = "/meetroomslot";
          const meetingRoomSlots = await postData(url, requestData, token);
          setNoData(false);
          setCardData(meetingRoomSlots);
        } catch (error) {
          console.error("Error occurred during data fetching:", error);
          setNoData(true);
        }
      }
    };

    if (viewBookingModalShow && MeetRoomID !== null && selectedDate !== null) {
      fetchData();
    }
  }, [MeetRoomID, selectedDate, token, viewBookingModalShow]);

  const onSelectOptions = (selectedList, selectedItem) => {
    if (selectedItem.guestName && selectedItem.guestEmail) {
      const updatedSuggestions = suggestions.filter(
        (option) => option.guestName !== selectedItem.guestName
      );
      setSelectedOptions((prevSelectedOptions) => [
        ...prevSelectedOptions,
        {
          guestName: selectedItem.guestName,
          guestEmail: selectedItem.guestEmail,
        },
      ]);
      setSuggestions(updatedSuggestions);
    }
  };

  const onRemoveOptions = (selectedList, removedItem, event) => {
    if (removedItem.guestName && removedItem.guestEmail) {
      const isItemInSuggestions = suggestions.some(
        (option) =>
          option.guestName === removedItem.guestName &&
          option.guestEmail === removedItem.guestEmail
      );
      if (!isItemInSuggestions) {
        suggestions.push({
          guestName: removedItem.guestName,
          guestEmail: removedItem.guestEmail,
        });
      }
      if (event && event.keyCode === 8 && suggestions.length > 0) {
        const firstSuggestion = suggestions[0];
        onSelectOptions(selectedList, firstSuggestion);
      }
      const updatedSelectedOptions = selectedOptions.filter(
        (option) => option.guestName !== removedItem.guestName
      );
      setSelectedOptions(updatedSelectedOptions);
    }
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleStartTime = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndtime = (e) => {
    setEndTime(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsBooking(true);

    const guestsArray = selectedOptions.map((option) => {
      return { guestName: option.guestName, guestEmail: option.guestEmail };
    });
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    const formData = {
      meetRoomId: MeetRoomID,
      title: title,
      date: date.split("-").reverse().join("/"),
      startTime: startTime,
      endTime: endTime,
      guests: guestsArray,

      description: description,
      clstartTime: startDateTime,
      clendTime: endDateTime,
    };

    const currentDate = new Date();
    const currentDateTime = currentDate.getTime();
    const selectedDate = new Date(`${date}T${startTime}`);
    const selectedDateTime = selectedDate.getTime();

    if (selectedDateTime < currentDateTime) {
      setIsBooking(false);
      setModalTitle("Error");
      setModalMessage("You cannot book a slot in the past.");
      setModalVariant("danger");
      setModalShow(true);
      return;
    }
    const startTimeStamp = new Date(`${date}T${startTime}`).getTime();
    const endTimeStamp = new Date(`${date}T${endTime}`).getTime();
    if (endTimeStamp <= startTimeStamp) {
      setIsBooking(false);
      setModalTitle("Error");
      setModalMessage("End time should be greater than the start time.");
      setModalVariant("danger");
      setModalShow(true);
      return;
    }

    try {
      const url = "/bookroom";
      const booksRoomRes = await postData(url, formData, token);
      console.log(booksRoomRes);
      if (booksRoomRes) {
        setIsBooking(false);
        setModalTitle("Success");
        setModalMessage("Meeting Room Booked Successfully.");
        setModalVariant("success");
        setModalShow(true);
        setTitle("");
        setDate("");
        setStartTime("");
        setEndTime("");
        setDescription("");
        setSelectedOptions([]);
      } else {
        setIsBooking(false);
        setModalTitle("Error");
        setModalMessage("Oops, something went wrong. Please try again later.");
        setModalVariant("danger");
        setModalShow(true);
      }
    } catch (error) {
      console.error("Error occurred during post request:", error);
      if (error.response) {
        if (error.response.status === 400) {
          setIsBooking(false);
          setModalTitle("Error");
          setModalMessage("Meeting slot is already occupied");
          setModalVariant("danger");
          setModalShow(true);
        } else if (error.response.status === 401) {
          setIsBooking(false);
          setModalTitle("Error");
          setModalMessage("Unauthorized. Please log in again");
          setModalVariant("danger");
          setModalShowUn(true);
        } else {
          setIsBooking(false);
          setModalTitle("Error");
          setModalMessage(
            "Oops, something went wrong. Please try again later."
          );
          setModalVariant("danger");
          setModalShow(true);
        }
      } else {
        setIsBooking(false);
        setModalTitle("Error");
        setModalMessage("Please check your internet connection.");
        setModalVariant("danger");
        setModalShow(true);
      }
      setModalShow(true);
    }
  };

  const handleCloseModal = () => {
    setModalShow(false);
    if (modalVariant === "success") {
      setShow(false);
      navigate("/booking");
    }
  };

  const handleNavigateToAdminRooms = () => {
    setShow(false);
  };

  const getStatusColor = () => {
    if (props.status === "Active") {
      return "green";
    } else if (props.status === "InActive") {
      return "#e15b5b";
    }
    return "black";
  };

  const statusColor = getStatusColor();

  const statusStyle = {
    color: statusColor,
    borderColor: statusColor,
  };

  const handleCloseModalUn = () => {
    setModalShow(false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    navigate("/login");
  };

  const handleDateSubmit = async (e) => {
    e.preventDefault();
    const [day, month, year] = dates.split("/");
    const selectedDateObject = new Date(`${year}/${month}/${day}`);
    if (!isNaN(selectedDateObject.getTime())) {
      const formattedDate = selectedDateObject.toLocaleDateString("en-GB");
      setSelectedDate(formattedDate);
      setViewBookingModalShow(true);
      const formDate = {
        meetRoomId: MeetRoomID,
        date: formattedDate,
      };
      const requestData = JSON.stringify(formDate);
      try {
        const url = "/meetroomslot";
        const meetingRoomSlots = await postData(url, requestData, token);
        setNoData(false);
        setCardData(meetingRoomSlots);
      } catch (error) {
        console.error("Error occurred during data fetching:", error);
        setNoData(true);
      }
    }
  };

  const handleRoomDetailsClick = async (e) => {
    e.preventDefault();
    setViewBookingModalShow(true);
  };

  return (
    <div className="roomcard">
      <div className="roomimg">
        <img className="meetingRoom" src={props.img} alt="img" />
      </div>
      <div style={{ display: "flex" }}>
        <h1 className="roomcardName">{props.name}</h1>
        <p className="roomcardStatus" style={statusStyle}>
          {props.status}
        </p>
      </div>
      <h2 className="roomcardTime">
        <span>
          <AiOutlineClockCircle />
        </span>{" "}
        {props.time}
      </h2>
      <div className="roomcardCapicity">
        <p className="capacity1">
          Capacity: <span>{props.inside}</span>
        </p>
      </div>

      <div style={{ display: "flex" }}>
        <Button
          className={`roomcardButton ${
            props.status === "Active" ? "Active" : "InActive"
          }`}
          variant={props.status === "Active" ? "dark" : "dark"}
          onClick={() => {
            if (props.status === "Active") {
              handleShow();
            }
          }}
        >
          {props.status === "Active" ? "Book a Slot" : "Booking Not Allowed"}
        </Button>
        <Button
          className="roomcardButton"
          style={{ width: "50%", marginLeft: "20px" }}
          onClick={handleRoomDetailsClick} // Assuming you have a variable called `roomId`
          variant="dark"
        >
          Room Details
        </Button>

        <Modal
          show={viewBookingModalShow}
          onHide={handleCloseViewBookingModal}
          centered
          dialogClassName="custom-modal modal-lg modal-fullscreen"
        >
          <Nav />
          <div
            className="allrooms"
            style={{ margin: "0px", marginBottom: "2.5rem" }}
          >
            <h1>
              {" "}
              Room Booking Details :{" "}
              <span>
                <strong> {props.name}</strong>
              </span>
            </h1>
            <div
              onClick={handleCloseViewBookingModal}
              className="me-2"
              style={{ color: "#774181" }}
            >
              <GrClose />
            </div>
          </div>

          <Modal.Body>
            <form className="formClass" onSubmit={handleDateSubmit}>
              <div
                className="BookingFormTitleInput"
                style={{ display: "flex" }}
              >
                <Form.Control
                  centered
                  style={{ width: "250px" }}
                  type="date"
                  name="date"
                  onChange={(e) => setDates(e.target.value)}
                  value={dates}
                  id="inputPassword5"
                  min={new Date().toISOString().split("T")[0]} // Set min attribute to current date
                  required
                />
                <button
                  type="submit"
                  className="btn btn-dark"
                  style={{ marginLeft: "10px" }}
                >
                  Submit
                </button>
              </div>
            </form>
            <hr />
            {noData ? (
              <Notdata error="Details Not Found" />
            ) : (
              <div className="table-responsive">
                <table
                  className="table table-striped table-bordered"
                  style={{ textAlign: "center" }}
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
                    {cardData?.map((item, index) => {
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
          </Modal.Body>
        </Modal>
      </div>

      <Offcanvas
        show={show}
        onHide={handleClose}
        style={{ background: "padding-box" }}
      >
        <Offcanvas.Body style={{ backdropFilter: "blur(2px)" }}>
          <div>
            <div className="BookingForm">
              <div className="BookingFormCard">
                <Form onSubmit={handleSubmit}>
                  <h1 className="BookingFormHeading">
                    Booking a Meeting : <span>{props.name}</span>
                  </h1>
                  <div className="cross1" onClick={handleNavigateToAdminRooms}>
                    <ImCross />
                  </div>
                  <br />
                  <hr />
                  <div className="BookingFormMTitle">
                    <Form.Label
                      className="BookingFormTitleLable"
                      htmlFor="inputPassword5"
                    >
                      Meeting Title *
                    </Form.Label>
                    <div className="BookingFormTitleInput">
                      <Form.Control
                        type="text"
                        name="title"
                        value={title}
                        onChange={handleTitle}
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        required
                      />
                    </div>
                  </div>

                  <div className="BookingFormMTitle">
                    <Form.Label
                      className="BookingFormTitleLable"
                      htmlFor="inputPassword5"
                    >
                      Select Date *
                    </Form.Label>
                    <div className="BookingFormTitleInput">
                      <Form.Control
                        type="date"
                        name="date"
                        value={date}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split("T")[0]} // Set min attribute to current date
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        required
                      />
                    </div>
                  </div>
                  <div className="BookingFormMTitle">
                    <Form.Label
                      className="BookingFormTitleLable"
                      htmlFor="inputPassword5"
                    >
                      Start Time *
                    </Form.Label>
                    <div className="BookingFormTitleInput">
                      <Form.Control
                        type="time"
                        name="startTime"
                        value={startTime}
                        // min={getCurrentTime()} // Set min attribute to current time
                        onChange={handleStartTime}
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        required
                      />
                    </div>
                  </div>
                  <div className="BookingFormMTitle">
                    <Form.Label
                      className="BookingFormTitleLable"
                      htmlFor="inputPassword5"
                    >
                      End Time *
                    </Form.Label>
                    <div className="BookingFormTitleInput">
                      <Form.Control
                        type="time"
                        name="endTime"
                        value={endTime}
                        onChange={handleEndtime}
                        id="inputPassword5"
                        // min={getCurrentTime()} // Set min attribute to current time
                        aria-describedby="passwordHelpBlock"
                        required
                      />
                    </div>
                  </div>
                  <div className="BookingFormMTitle">
                    <Form.Label
                      className="BookingFormTitleLable"
                      htmlFor="inputPassword5"
                    >
                      Add guests
                    </Form.Label>
                    <div className="BookingFormTitleInput">
                      <Multiselect
                        id="inputPassword5"
                        options={suggestions}
                        name="particulars"
                        onSelect={onSelectOptions}
                        onRemove={onRemoveOptions}
                        displayValue="guestName"
                        closeIcon="cancel"
                        placeholder="Select Guests"
                        selectedValues={selectedOptions}
                        className="multiSelectContainer"
                      />
                    </div>
                  </div>
                  <div className="BookingFormMTitle">
                    <Form.Label
                      className="BookingFormTitleLable"
                      htmlFor="inputPassword5"
                    >
                      Description of Meeting
                    </Form.Label>
                    <div className="BookingFormTitleInput">
                      <Form.Control
                        type="text"
                        onChange={handleDescription}
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                        as="textarea"
                        row={5}
                      />
                    </div>
                  </div>
                  <div className="BookingFormSaveBtn">
                    <button
                      type="submit"
                      className={isBooking ? "disabled" : ""}
                      disabled={isBooking}
                    >
                      {" "}
                      {isBooking ? "Loading..." : "Book"}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal
        show={modalShow}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant={modalVariant} onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
}
export default RoomCardMain;
