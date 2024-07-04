import React, { useState, useContext, useEffect } from "react";
import "./Booking.css";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Form from "react-bootstrap/Form";
import Multiselect from "multiselect-react-dropdown";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { GuestListContext } from "../../context/GuestListContext";
import { deleteData, fetchData, patchData } from "../../apiUtils/apiFunctions";
function CurrentStatusCard(props) {
  const ticket = Number(sessionStorage.getItem("userId"));
  const userId = props.userId;
  const isOwner = ticket === userId;
  const isActive = props.status === "Active";
  const [show, setShow] = useState(false);
  const [deleteDataConfirmation, setDeleteDataConfirmation] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [editSuccessModalShow, setEditSuccessModalShow] = useState(false);
  const [deleteSuccessModalShow, setDeleteSuccessModalShow] = useState(false);
  const [editNotModalShow, setEditNotModalShow] = useState(false);
  const [editErrorModalShow, setEditErrorModalShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalVariant, setModalVariant] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [modalShowUn, setModalShowUn] = useState(false);
  const navigate = useNavigate();
  const guestList = useContext(GuestListContext);

  useEffect(() => {
    const formattedOptions = guestList.map((guest) => ({
      guestName: guest.guestName,
      guestEmail: guest.guestEmail,
    }));
    setSuggestions(formattedOptions);
  }, [guestList]);
  const handleNavigateToEdit = () => {
    setShow(false);
  };
  const editCardData = async (id) => {
    try {
      setShow(true);
      const url = `/fetchBookingWithId/${id}`;
      const token = JSON.parse(sessionStorage.getItem("token"));
      const fetchBookingRes = await fetchData(url, token);
      const parts = fetchBookingRes.date.split("/");
      if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        const converted = `${year}-${month}-${day}`;
        setDate(converted);
      }
      setTitle(fetchBookingRes.title);
      setStartTime(fetchBookingRes.startTime);
      setEndTime(fetchBookingRes.endTime);
      setSelectedOptions(fetchBookingRes.guests);
      setDescription(fetchBookingRes.description);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const edithandleTitle = (e) => {
    setTitle(e.target.value);
  };

  const edithandleDate = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (selectedDate < today) {
      setDate(today);
    } else {
      setDate(selectedDate);
    }
  };
  const edithandleStartTime = (e) => {
    setStartTime(e.target.value);
  };

  const edithandleEndtime = (e) => {
    setEndTime(e.target.value);
  };
  const edithandleDescription = (e) => {
    setDescription(e.target.value);
  };

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

  const onRemoveOptions = (selectedList, removedItem) => {
    // Check if removedItem is truthy and not the backspace key
    if (removedItem.guestName && removedItem.guestEmail) {
      if (
        !suggestions.some(
          (option) => option.guestName === removedItem.guestName
        )
      ) {
        suggestions.push({
          guestName: removedItem.guestName,
          guestEmail: removedItem.guestEmail,
        });
      }

      const updatedSelectedOptions = selectedOptions.filter(
        (option) => option.guestName !== removedItem.guestName
      );
      setSelectedOptions(updatedSelectedOptions);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(true);
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    const guestsArray = selectedOptions.map((option) => {
      return { guestName: option.guestName, guestEmail: option.guestEmail };
    });
    const updatedData = {
      meetRoomId: props.meetRoomId,
      title: title,
      date: date.split("-").reverse().join("/"),
      startTime: startTime,
      endTime: endTime,
      guests: guestsArray,
      description: description,
      clstartTime: startDateTime,
      clendTime: endDateTime,
    };
    const startTimeStamp = new Date(`${date}T${startTime}`).getTime();
    const endTimeStamp = new Date(`${date}T${endTime}`).getTime();
    if (endTimeStamp <= startTimeStamp) {
      setModalTitle("Error");
      setModalMessage("End time should be greater than the start time.");
      setModalVariant("danger");
      setModalShow(true);
      setIsEditing(false);

      return;
    }

    const currentDate = new Date();
    const currentDateTime = currentDate.getTime();
    const selectedDate = new Date(`${date}T${startTime}`);
    const selectedDateTime = selectedDate.getTime();

    if (selectedDateTime < currentDateTime) {
      setModalTitle("Error");
      setModalMessage("You cannot edit a slot in the past time.");
      setModalVariant("danger");
      setModalShow(true);
      setIsEditing(false);

      return;
    }
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const url = `/editbookings/${props.id}`;
      const editBookingRes = await patchData(url, token, updatedData);
      if (editBookingRes) {
        setEditSuccessModalShow(true);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      setEditNotModalShow(true);
      setIsEditing(false);
    }
  };
  const deleteDataConfirmationclose = () => {
    setDeleteDataConfirmation(false);
  };
  const deleteDataCall = async (id) => {
    setDeleteDataConfirmation(false);
    const token = JSON.parse(sessionStorage.getItem("token"));
    const currentDate = new Date();
    const currentDateTime = currentDate.getTime();
    const selectedDate = new Date(`${date}T${startTime}`);
    const selectedDateTime = selectedDate.getTime();

    if (selectedDateTime < currentDateTime) {
      setModalTitle("Error");
      setModalMessage("You cannot delete a meeting slot in the past time.");
      setModalVariant("danger");
      setModalShow(true);
      return;
    }
    try {
      const url = `/DeleteBookings/${id}`;
      const deleteBookings = await deleteData(url, token);
      if (deleteBookings) {
        setDeleteSuccessModalShow(true);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      if (error.response) {
        if (error.response.data.status === 401) {
          setModalShowUn(true);
          setModalTitle("Error");
          setModalMessage("Unauthorized. Please log in again");
          setModalVariant("danger");
        } else {
          setModalTitle("Error");
          setModalMessage("You cannot delete a meeting slot.");
          setModalVariant("danger");
          setModalShow(true);
        }
      }
    }
  };

  const handleCloseModalUn = () => {
    setModalShowUn(false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    navigate("/login");
  };
  const handleCloseModal = () => {
    setModalShow(false);
  };

  return (
    <>
      <tr key={props.id}>
        <td className="text-center">{props.index + 1}</td>
        <td className="text-center">{props.Rname}</td>
        <td className="text-center">
          {props.Issuer} {props.lname}
        </td>
        <td className="text-center">{props.Date}</td>
        <td className="text-center">{props.from}</td>
        <td className="text-center">{props.to}</td>
        <td className="text-center">
          {isOwner && isActive && (
            <span
              onClick={() => {
                editCardData(props.id);
              }}
            >
              <FiEdit3 id="edit" />
            </span>
          )}
        </td>
        <td className="text-center">
          {isOwner && isActive && (
            <span onClick={() => setDeleteDataConfirmation(true)}>
              <AiOutlineDelete className="Hovicon" />
            </span>
          )}
        </td>
      </tr>
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        style={{ background: "padding-box" }}
      >
        <Offcanvas.Body style={{ backdropFilter: "blur(2px)" }}>
          <div>
            <div className="BookingForm">
              <div className="BookingFormCard">
                <Form onSubmit={handleEditSubmit}>
                  <h1 className="BookingFormHeading">
                    Edit a Meeting : <span>{props.Rname}</span>
                  </h1>
                  <div className="cross1" onClick={handleNavigateToEdit}>
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
                        onChange={edithandleTitle}
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
                      Change Date *
                    </Form.Label>
                    <div className="BookingFormTitleInput">
                      <Form.Control
                        style={{ width: "250px" }}
                        type="date"
                        name="date"
                        value={date}
                        onChange={edithandleDate}
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
                        style={{ width: "200px" }}
                        type="time"
                        name="startTime"
                        value={startTime}
                        onChange={edithandleStartTime}
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
                        style={{ width: "200px" }}
                        type="time"
                        name="endTime"
                        value={endTime}
                        onChange={edithandleEndtime}
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
                      Add guests
                    </Form.Label>
                    <div className="multiSelectContainer">
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
                        value={description}
                        onChange={edithandleDescription}
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
                      className={isEditing ? "disabled" : ""}
                      disabled={isEditing}
                    >
                      {" "}
                      {isEditing ? "Loading..." : "Save"}
                    </button>
                  </div>
                </Form>
              </div>
              <Modal
                show={editErrorModalShow}
                onHide={() => setEditErrorModalShow(false)}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  This meeting cannot be edited as it is less than one hour from
                  now.
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="primary"
                    onClick={() => setEditErrorModalShow(false)}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <Modal show={deleteDataConfirmation} onHide={deleteDataConfirmationclose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => deleteDataCall(props.id)}>
            Yes
          </Button>
          <Button variant="primary" onClick={deleteDataConfirmationclose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={editSuccessModalShow}
        onHide={() => {
          setEditSuccessModalShow(false);
          props.onUpdate();
          setShow(false);
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Data edited successfully</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setEditSuccessModalShow(false);
              props.onUpdate();
              setShow(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={editNotModalShow}
        onHide={() => setEditNotModalShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel</Modal.Title>
        </Modal.Header>
        <Modal.Body>Meeting slot is already occupied</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setEditNotModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={deleteSuccessModalShow}
        onHide={() => {
          setDeleteSuccessModalShow(false);
          props.onUpdate();
        }}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Booking Deleted Successfully</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setDeleteSuccessModalShow(false);
              props.onUpdate();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
    </>
  );
}
export default CurrentStatusCard;
