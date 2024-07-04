import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import AdminAddRooms from "./Admin/AdminPages/AdminAddRooms";
import AdminAllRooms from "./Admin/AdminPages/AdminAllRooms";
import AdminRoomDetails from "./Admin/AdminPages/AdminRoomDetails";
import Dashbord from "./Admin/AdminPages/Dashbord";
import AdminLogin from "./Admin/Login/AdminLogin";
import AdminIndex from "./DeskBooking/Admin/AdminIndex";
import Index from "./DeskBooking/User/Index";
import Booking from "./Pages/Booking/Booking";
import Notdata from "./Pages/Components/Loading/Notdata";
import History from "./Pages/History/History";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login_Signup/Login";
import AdminProtected from "./ProtectedRoute/AdminProtected";
import Protected from "./ProtectedRoute/Protected";
import UserDeskProtected from "./ProtectedRoute/UserDeskProtected";
import AdminDeskProtected from "./ProtectedRoute/AdminDeskProtected";
import UserDeskBookingHistory from "./DeskBooking/User/UserDeskBookingHistory";
import AdminDeskBookingHistory from "./DeskBooking/Admin/AdminDeskBookingHistory";
const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Protected Components={Home} />} />
        <Route path="/booking" element={<Protected Components={Booking} />} />
        <Route path="/history" element={<Protected Components={History} />} />
        <Route
          path="/deskbooking"
          element={<UserDeskProtected Components={Index} />}
        />
        <Route
          path="/admin/deskbooking"
          element={<AdminDeskProtected Components={AdminIndex} />}
        />
        <Route
          path="bookings"
          element={<UserDeskProtected Components={UserDeskBookingHistory} />}
        />{" "}
        <Route
          path="admin/bookings"
          element={<AdminDeskProtected Components={AdminDeskBookingHistory} />}
        />
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/dashbord"
          element={<AdminProtected Components={Dashbord} />}
        />
        <Route path="/admin/allrooms" element={<AdminAllRooms />} />
        <Route
          path="/admin/addrooms"
          element={<AdminProtected Components={AdminAddRooms} />}
        />
        <Route
          path="/meetrooms/:id"
          element={<AdminProtected Components={AdminRoomDetails} />}
        />
        <Route path="/*" element={<Notdata error="Page Not Found" />} />
      </Routes>
    </div>
  );
};

export default App;
