import BASE_URL from '../config/api'
import axios from 'axios';
const user = axios.create({baseURL:BASE_URL})

export const userRequest = async ({ ...options }) => {
    //the Authorization header
    user.defaults.headers.common.Authorization = JSON.parse(  
      localStorage.getItem("UserToken")
    );
    const onSuccess = (response) => response;
    const onError = (error) => {
      console.log("axios interceptor", error);
      return error;
    };
    return user(options).then(onSuccess).catch(onError);
  };

  export const ArtistRequest = async ({...options }) => {
    // the Authorization header
    user.defaults.headers.common.Authorization = JSON.parse(
      localStorage.getItem("artistToken")
    );
    const onSuccess = (response) => response;
    const onError = (error) => {
      console.log('axios interceptor',error);
      return error;
    };
    return user(options).then(onSuccess).catch(onError)
  }

  export const adminRequest = async ({ ...options }) => {
    user.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem("adminToken")}`;
    const onSuccess = (response) => response;
    const onError = (error ) => {
      console.log("axios interceptor",error)
      return error;
    }
    try {
      const response = await user(options)
      return onSuccess(response)
    } catch (error) {
      return onError(error)
    }
  }