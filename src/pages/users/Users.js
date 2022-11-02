import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import DoneIcon from '@material-ui/icons/DoneAllTwoTone';
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Header from '../../component/Header';
import Cookies from 'js-cookie';
import { getUsers } from '../../services/user';
import Popover from '@mui/material/Popover';
import AssignCamera from '../../component/AssignCamera'
import '../../App.css';
import { deleteUserAccessToCameraApi, getUserCamerasApi } from '../../services/Camera';
import { updateUserPermistion } from '../../services/user';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },

}));

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align='left' className='tableCell'>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

const Cameras = () => {
  const [rows, setRows] = useState();
  const [previous, setPrevious] = React.useState({});
  const [userId, setUserId] = React.useState('');
  const [users, setUsers] = React.useState('');
   const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const onToggleEditMode = (id) => {
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
     getUserCamerasApi(userId)
      .then((result) => {
        const res = result.data.result.map((val) => {
          return {
            id: val.id,
            name: val.name,
            permission: val.editConnected + 0,
            room: val.room_id,
            // editConnected: val.editConnected,
          };
        });
        setRows(res);
        handleClose();
      })
      .catch((err) => {
        if (err.response.status === 401) window.location = '/';
      });
    if (!Cookies.get('connect.sid')) window.location = '/';
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onRevert = (id) => {
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    setRows(newRows);
    setPrevious((state) => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getUsers();
      if (result) {
        const res = result.data.map((val) => {
          return { id: val.id, name: val.email };
        });
        setUsers(res);
      }
    };
    fetchUsers();
    if (!Cookies.get('connect.sid')) window.location = '/';
  }, []);

  const handelDeleteAcessUserToCamera = (cameraId) => {
    deleteUserAccessToCameraApi(userId, cameraId);
    const updated = rows.filter((item) => item.id !== cameraId);
    setRows(updated);
  };

  const handelUpdate = (cameraId, perm) => {
     onToggleEditMode(id);
   
    const data =  {user_id: parseInt(userId), camera_id:parseInt(cameraId), role:parseInt(perm)}
    updateUserPermistion(data);
  };

  return (
    <div>
      <Header />
      <div className='tabBtn'>
        
          <AssignCamera/>
        <>
          <Button
            aria-describedby={id}
            variant='contained'
            onClick={handleClick}
          >
            select user
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
              <label>User:</label>
              <select         defaultValue=""
  name='users' onChange={(e) => setUserId(e.target.value)}>
              <option value="" disabled>
                  Select the user
               </option>
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
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align='left'>Name</TableCell>
              <TableCell align='left'>Permission (ON/OFF)</TableCell>
              <TableCell align='left'>Room</TableCell>
              <TableCell align='right'>Actions</TableCell>
              <TableCell align='right' />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    {row.id}
                  </TableCell>
                  <CustomTableCell {...{ row, name: 'name', onChange }} />
                  
                    <CustomTableCell
                      {...{ row, name: 'permission', onChange }}
                    />
                 
        
                  

                  <CustomTableCell {...{ row, name: 'room', onChange }} />

                  <TableCell align='right'>
                    <IconButton
                      onClick={() => handelDeleteAcessUserToCamera(row.id)}
                      aria-label='delete'
                      size='medium'
                    >
                      <DeleteIcon fontSize='inherit' />
                    </IconButton>
                  </TableCell>
                  <TableCell align='right' className='selectTableCell'>
                    {row.isEditMode ? (
                      <>
                        <IconButton
                          aria-label='done'
                          onClick={() =>
                            handelUpdate(
                              row.id,
                              row.permission,
                            )
                          }
                        >
                          <DoneIcon />
                        </IconButton>
                        <IconButton
                          aria-label='revert'
                          onClick={() => onRevert(row.id)}
                        >
                          <RevertIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        aria-label='delete'
                        onClick={() => onToggleEditMode(row.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Cameras;
