import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateCamera from "../../component/CreateCamera";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../component/Header";
import Cookies from "js-cookie";
import {
  getCamerasApi,
  deleteCameraApi,
  updateCameraApi,
} from "../../services/Camera";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 0,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 100,
    height: 30,
  },
}));

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="left" className="tableCell">
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
    const fetchData = async () => {
      getCamerasApi()
        .then((result) => {
          const res = result.data.result.map((val) => {
            return {
              id: val.id,
              name: val.name,
              connected: val.connected + 0,
              room: val.room_id,
              editConnected: val.editConnected,
            };
          });
          setRows(res);
        })
        .catch((err) => {
          if (err.response.status === 401) window.location = "/";
        });
    };
    fetchData();
    if (!Cookies.get("connect.sid")) window.location = "/";
  }, []);

  const handelDeleteCamera = (cameraId) => {
    deleteCameraApi(cameraId);
    const updated = rows.filter((item) => item.id !== cameraId);
    setRows(updated);
  };

  const handelUpdate = (id, name, connected, room_id) => {
    onToggleEditMode(id);
    updateCameraApi(id, name, connected, room_id);
  };

  return (
    <div>
      <Header />
      <div className="tabBtn">
        <CreateCamera />
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Connected</TableCell>
              <TableCell align="left">Room</TableCell>
              <TableCell align="right">Actions</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <CustomTableCell {...{ row, name: "name", onChange }} />
                  {row.editConnected ? (
                    <CustomTableCell
                      {...{ row, name: "connected", onChange }}
                    />
                  ) : (
                    <TableCell component="th" scope="row">
                      {row.connected}
                    </TableCell>
                  )}

                  <CustomTableCell {...{ row, name: "room", onChange }} />

                  <TableCell align="right">
                    <IconButton
                      onClick={() => handelDeleteCamera(row.id)}
                      aria-label="delete"
                      size="medium"
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right" className="selectTableCell">
                    {row.isEditMode ? (
                      <>
                        <IconButton
                          aria-label="done"
                          onClick={() =>
                            handelUpdate(
                              row.id,
                              row.name,
                              row.connected,
                              row.room
                            )
                          }
                        >
                          <DoneIcon />
                        </IconButton>
                        <IconButton
                          aria-label="revert"
                          onClick={() => onRevert(row.id)}
                        >
                          <RevertIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        aria-label="delete"
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
