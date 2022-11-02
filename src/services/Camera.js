import axios from 'axios';

axios.defaults.withCredentials = true;

const getCamerasApi = async () => {
  return await axios('http://127.0.0.1:3005/api/camera');
};
const getUnassignedCamerasApi = async (id) => {
  return await axios(`http://127.0.0.1:3005/api/unassigned-cameras/${id}`);
};
const getUserCamerasApi = async (id) => {
  
  return await axios(`http://127.0.0.1:3005/api/user-camera/${id}`);
};

const deleteCameraApi = async (cameraId) => {
  return axios.delete('http://127.0.0.1:3005/api/camera', {
    data: {
      id: cameraId,
    },
  });
};

const deleteUserAccessToCameraApi = async (userId, cameraId) => {
  return axios.delete('http://127.0.0.1:3005/api/camera-user', {
    data: {
      user_id: userId,
      camera_id:cameraId
    },
  });
};
const updateCameraApi = async (id, name, connected, room_id)=>{
    axios.put('http://127.0.0.1:3005/api/camera', {
        id, name, connected, room_id});
}

const createCameraApi = async (data)=>{
  axios.post('http://127.0.0.1:3005/api/camera', data);
}

export { getCamerasApi,
         deleteCameraApi,
         updateCameraApi,
         createCameraApi,
         getUserCamerasApi,
         deleteUserAccessToCameraApi,
         getUnassignedCamerasApi
         };
