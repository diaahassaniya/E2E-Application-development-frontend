import axios from 'axios';

axios.defaults.withCredentials = true;

const getRoomsApi = async () => {
  return await axios('http://127.0.0.1:3005/api/room');
};

const deleteRoomApi = async (roomId) => {
  axios.delete('http://127.0.0.1:3005/api/room', {
      data: {
        id: roomId,
      },
    });
};

const updateRoomApi = async (id, name)=>{
  axios.put('http://127.0.0.1:3005/api/room', { id, name });
}
const createRoomApi = async (data)=>{
  axios.post('http://127.0.0.1:3005/api/room', {
    name:data
  });
}

export { getRoomsApi, deleteRoomApi, updateRoomApi, createRoomApi };
