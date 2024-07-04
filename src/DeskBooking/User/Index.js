import React from "react";
import Nav from "../../Pages/Components/Nav/Nav";
import "../../Pages/Components/Nav/Nav.css";
import DeskBookTable from "../components/DeskBookTable";
export default function Index() {
  return (
    <>
      <div className="stickyClass">
        <Nav isDeskBookingUser={true} />
      </div>
      <div className="deskbooktable">
        <DeskBookTable />
      </div>
    </>
  );
}
