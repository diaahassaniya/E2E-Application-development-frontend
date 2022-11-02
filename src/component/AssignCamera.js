import React, { useState, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import '../App.css'
import { getUnassignedCamerasApi } from '../services/Camera';
import { assignCamera, getUsers } from '../services/user';

const AssignCamera = () => {
  const [cameraId, setCameraId] = React.useState();
  const [userId, setUserId] = React.useState();
  const [cameras, setCameras] = React.useState('');
  const [users, setUsers] = React.useState('');

  
  const handleSubmit = (event) => {
    const data = { camera_id: cameraId, user_id: userId };
    assignCamera(data)
    event.preventDefault();
  };

  useEffect(  ()=> {

    const getUnassignedCamaras = async () =>{
      if(userId){
            const result = await getUnassignedCamerasApi(userId);
           if (result.data) {
             const res = result.data.map((val) => {
               return { id: val.id, name: val.name };
             });
             setCameraId(res[0].id);
             setCameras(res);
           }
         
       }
    }

getUnassignedCamaras()
  }, [userId]);

  useEffect(() => {
   
    const fetchUsers = async () => {
      const result = await getUsers();
      if (result) {
        const res = result.data.map((val) => {
          return { id: val.id, name: val.email };
        });
        
        setUsers(res);
        setUserId(res[0].id);
      }
    };

    fetchUsers();
  }, []);


  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Button aria-describedby={id} variant='contained' onClick={handleClick}>
        Assign Camera
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <form onSubmit={handleSubmit}>
         
         
          <label>Camera</label>
          <select name='cameras' onChange={(e) => setCameraId(e.target.value)}>
            {cameras &&
              cameras.map((val,index) => {
                return (
                  <option key={val.id} value={val.id}>
                    {val.name}
                  </option>
                );
              })}
          </select>
          
          <label>users</label>
          <select name='users' onChange={(e) => setUserId(e.target.value)}>
            {users &&
              users.map((val) => {
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

export default AssignCamera;
