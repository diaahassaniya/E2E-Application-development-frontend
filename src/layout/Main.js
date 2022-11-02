import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Header from "../component/Header";
import Cookies from "js-cookie";

const Main = (props) => {
  const [role, setRole] = useState("");
  useEffect(() => {
    if (!Cookies.get("connect.sid")) window.location = "/";
    setRole(localStorage.getItem("role"));
  }, []);
  const navigate = useNavigate();
  return (
    <div className="mainApp">
      <Header />
      <div className="main">
        {role === "1" && (
          <div>
            <Button variant="contained" onClick={() => navigate("/users")}>
              Users
            </Button>
          </div>
        )}
        <div>
          <Button variant="contained" onClick={() => navigate("/room")}>
            Rooms
          </Button>
        </div>
        <div>
          <Button variant="contained" onClick={() => navigate("/camera")}>
            Cameras
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Main;
