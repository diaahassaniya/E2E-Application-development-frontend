import axios from "axios";

axios.defaults.withCredentials = true;

const assignCamera = async (data) => {
  axios.post("http://127.0.0.1:3005/api/camera-user", data);
};

const updateUserPermistion = async (data) => {
  axios.post("http://127.0.0.1:3005/api/permistion", data);
};
const deleteUserAccessToCamera = async (data) => {
  axios.delete("http://127.0.0.1:3005/api/camera-user", data);
};

const getUsers = async () => {
  return await axios("http://127.0.0.1:3005/api/users");
};
const logout = async () => {
  return await axios.post("http://127.0.0.1:3005/api/logout");
};

const login = async (data) => {
  return await axios.post("http://127.0.0.1:3005/api/login", data);
};

const register = async (data) => {
  return await axios.post("http://127.0.0.1:3005/api/register", data);
};
export {
  assignCamera,
  getUsers,
  logout,
  login,
  register,
  deleteUserAccessToCamera,
  updateUserPermistion,
};
