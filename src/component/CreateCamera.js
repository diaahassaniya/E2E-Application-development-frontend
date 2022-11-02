import React, { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import "../App.css";
import { createCameraApi } from "../services/Camera";
import { getRoomsApi } from "../services/Rooms";

const CreateCamera = () => {
  const [name, setName] = React.useState("");
  const [connected, setConnected] = React.useState("");
  const [roomId, setRoomId] = React.useState("");
  const [rooms, setRooms] = React.useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleSubmit =  (event) => {
    const data = { name, connected, room_id: roomId };
    createCameraApi(data);
 
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getRoomsApi();
      if (result) {
        const res = result.data.map((val) => {
          return { id: val.id, name: val.name };
        });
        setRooms(res);
      }
    };
    fetchData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Create camera
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
            Camera Name:
            <input
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Connected:
            <input
              name="connected"
              type="number"
              value={connected}
              max={1}
              min={0}
              onChange={(e) => setConnected(e.target.value)}
              required
            />
          </label>
          <label>Room Name:</label>
          <select name="rooms" onChange={(e) => setRoomId(e.target.value)}>
            {rooms &&
              rooms.map((val) => {
                return (
                  <option key={val.id} value={val.id}>
                    {val.name}
                  </option>
                );
              })}
          </select>

          <button>Submit</button>
        </form>
      </Popover>
    </>
  );
};

export default CreateCamera;
