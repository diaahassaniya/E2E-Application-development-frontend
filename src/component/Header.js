import React from "react";
import Button from "@mui/material/Button";
import { logout } from "../services/user";
import {useNavigate} from "react-router-dom"
import "../App.css";

const Header = () => {
  const handleClick = async () => {
    logout().then(() => {
      window.location = "/";
    });
  };
  const navigate = useNavigate();

  return (
    <div className="header">
      <div>
        <Button variant="contained" onClick={() =>  navigate("/main")}>
           Home Page
        </Button>
      </div>
      <div>
        <Button variant="contained" onClick={() => handleClick()}>
          logout
        </Button>
      </div>
    </div>
  );
};

export default Header;
