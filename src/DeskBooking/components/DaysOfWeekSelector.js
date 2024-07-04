import React, { useEffect, useState } from "react";

const DaysOfWeekSelector = ({
  selectedDays,
  handleDayToggle,
  duration,
  selectedDate,
}) => {
  const [disabledDays, setDisabledDays] = useState([]);

  /* This `useEffect` hook is responsible for updating the list of disabled days based on the selected date and duration. */
  useEffect(() => {
    const today = new Date();
    const todayIndex = today.getDay();
    const [day, month, year] = selectedDate.split("/").map(Number);
    const selectedDateObject = new Date(year, month - 1, day);
    const currentWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - todayIndex
    );
    const currentWeekEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + (6 - todayIndex)
    );
    if (
      duration === 1 &&
      selectedDateObject >= currentWeekStart &&
      selectedDateObject <= currentWeekEnd
    ) {
      const newDisabledDays = [];
      for (let i = 0; i < todayIndex; i++) {
        newDisabledDays.push(i);
      }
      setDisabledDays(newDisabledDays);
    } else {
      setDisabledDays([]);
    }
  }, [duration, selectedDate]);

  const isDisabled = (day) => {
    const dayIndex = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].indexOf(day);
    return disabledDays.includes(dayIndex);
  };

  return (
    <div style={{ width: "20rem" }}>
      {[
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].map((day, index) => (
        <button
          key={day}
          onClick={() => handleDayToggle(day)}
          style={{
            margin: "2px",
            padding: "4px",
            height: "2.5rem",
            width: "2rem",
            background: selectedDays.includes(day) ? "#66c2ff" : "#f2f2f2",
            pointerEvents: isDisabled(day) ? "none" : "auto",
            opacity: isDisabled(day) ? 0.5 : 1,
          }}
          disabled={isDisabled(day)}
        >
          {day.charAt(0)}
        </button>
      ))}
    </div>
  );
};

export default DaysOfWeekSelector;
