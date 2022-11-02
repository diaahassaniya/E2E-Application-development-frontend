import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateRoom from "../../component/CreateRoom";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../component/Header";
import Cookies from "js-cookie";
import {
  getRoomsApi,
  deleteRoomApi,
  updateRoomApi,
} from "../../services/Rooms";
 
const CustomTableCell = ({ row, name, onChange }) => {
  const { isEditMode } = row;
  return (
    <TableCell align="left" className="tableCell">
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className="input2"
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

const Rooms = () => {
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

      getRoomsApi()
        .then((result) => {
          const res = result.data.map((val) => {
            return { id: val.id, name: val.name };
          });
          setRows(res);
        })
        .catch((err) => {
          console.log("err", err);
          if (err.response.status === 401) window.location = "/";
        });
    };
    fetchData();
    if (!Cookies.get("connect.sid")) window.location = "/";
  }, []);

  const handelDeleteRoom = async (roomId) => {
    deleteRoomApi(roomId);

    const updated = rows.filter((item) => item.id !== roomId);
    setRows(updated);
  };

  const handelUpdate = (id, name) => {
    onToggleEditMode(id);
    updateRoomApi(id, name);
  };

  return (
    <div>
      <Header />
      <div className="tabBtn">
        <CreateRoom />
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">name</TableCell>
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

                  <TableCell align="right">
                    <IconButton
                      onClick={() => handelDeleteRoom(row.id)}
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
                          onClick={() => handelUpdate(row.id, row.name)}
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

export default Rooms;
