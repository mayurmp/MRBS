import React, { createContext, useState, useEffect } from "react";
import { fetchData } from "../apiUtils/apiFunctions";
export const GuestListContext = createContext();

export const GuestListProvider = ({ children }) => {
  const [guestList, setGuestList] = useState([]);

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const getGuestList = async () => {
      try {
        const url = "/GetAllGuests";
        const list = await fetchData(url, token);
        setGuestList(list);
      } catch (error) {
        console.error("Error occurred while fetching guest list:", error);
      }
    };
    if (token) {
      getGuestList();
    }
  }, []);

  return (
    <GuestListContext.Provider value={guestList}>
      {children}
    </GuestListContext.Provider>
  );
};
