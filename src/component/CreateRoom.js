import React from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import { createRoomApi } from "../services/Rooms";
import "../App.css";

const CreateRoom = () => {
  const [name, setName] = React.useState("");

  const handleSubmit = (event) => {
    createRoomApi(name);
    setName("");
    React.setRows({});
    event.preventDefault();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        create room
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <form onSubmit={handleSubmit}>
          <label>
            Room Name:
            <input
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <button>Submit</button>
        </form>
      </Popover>
    </>
  );
};

export default CreateRoom;
