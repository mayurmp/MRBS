import axios from "axios";
import Api from "../Api";

// fetch data api calling
export const fetchData = async (url, token) => {
  try {
    const res = await axios.get(`${Api}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });
    return res.data.result;
  } catch (error) {
    console.error("Error fetching Data:", error);
    throw error;
  }
};
// post data api call
export const postData = async (url, initialRequestBody, token = null) => {
  try {
    const response = await axios.post(`${Api}${url}`, initialRequestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error  for post data", error);
    throw error;
  }
};
// post multiform data api call
export const postMultiFormData = async (url, token, initialRequestBody) => {
  try {
    const response = await axios.post(`${Api}${url}`, initialRequestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": true,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error  for post data", error);
    throw error;
  }
}; // post multiform data api call
export const patchMultiFormData = async (url, token, initialRequestBody) => {
  try {
    const response = await axios.patch(`${Api}${url}`, initialRequestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": true,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error  for post data", error);
    throw error;
  }
};
// patch data api call
export const patchData = async (url, token, initialRequestBody) => {
  try {
    const response = await axios.patch(`${Api}${url}`, initialRequestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error  for post data", error);
    throw error;
  }
};
// delete data api call
export const deleteData = async (url, token) => {
  try {
    const response = await axios.delete(`${Api}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error deleting desk:", error);
    throw error;
  }
};

// post desk data api call
export const postDeskData = async (url, token, initialRequestBody) => {
  try {
    const response = await axios.post(`${Api}${url}`, initialRequestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });
    return response;
  } catch (error) {
    console.error("Error  for post data", error);
    throw error;
  }
};
