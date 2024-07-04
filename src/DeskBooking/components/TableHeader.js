import { format } from "date-fns";
import React from "react";
import { RiArrowDropLeftLine, RiArrowDropRightLine } from "react-icons/ri";
import "../components/DeskBookTable.css";

const TableHeader = ({ dates, handleNextData, handlePrevData }) => {
  const currentDate = new Date();
  
  /* The function `isCurrentDate` checks if the input date matches the current date.*/
  const isCurrentDate = (date) => {
    const formattedCurrentDate = format(currentDate, "dd/MM/yyyy");
    return formattedCurrentDate === date;
  };

  return (
    <thead>
      <tr className="thead">
        <th>
          <div className="desks">
            Desks
            <button
              onClick={handlePrevData}
              style={{
                cursor: "pointer",
                marginLeft: "9rem",
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              <RiArrowDropLeftLine size={30} />
            </button>
          </div>
        </th>
        {dates?.map((date) => (
          <th
            key={date.date}
            className={isCurrentDate(date.date) ? "currentdate" : ""}
          >
            <div className="daydate">{date.day}</div>
            <div>{date.date}</div>
          </th>
        ))}
        <th>
          <button
            onClick={handleNextData}
            style={{
              cursor: "pointer",
              border: "none",
              backgroundColor: "transparent",
            }}
          >
            <RiArrowDropRightLine size={30} />
          </button>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
