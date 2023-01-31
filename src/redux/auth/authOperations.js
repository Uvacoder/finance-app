import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import Notiflix from 'notiflix';
import { notifySettings } from '../../utils/notifySettings';

export const instance = axios.create({
  baseURL: 'https://kapusta-backend.goit.global',
});

const setToken = token => {
  if (token) {
    return (instance.defaults.headers.common.Authorization = `Bearer ${token}`);
  }
  instance.defaults.headers.common.Authorization = '';
};

instance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      const refreshToken = JSON.parse(
        localStorage.getItem('persist:root')
      ).refreshToken;
      const sid = JSON.parse(localStorage.getItem('persist:root')).sid;
      try {
        setToken(refreshToken);
        const { data } = await instance.post('/auth/refresh', { sid });
        setToken(data.accessToken);
        return instance(error.config);
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/info',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state.auth.token;
      setToken(accessToken);
      const { data } = await instance.get('/user');
      return data;
    } catch ({ response }) {
      const { status, data } = response;
      const error = {
        status,
        message: data.message,
      };
      console.log(error.message);
      const state = getState();
      const { lang } = state.language.lang;
      lang === 'en'
        ? Notiflix.Notify.failure(`Please login again!`, notifySettings)
        : Notiflix.Notify.failure(
            `Будь ласка, залогіньтесь знову!`,
            notifySettings
          );
      return rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const { data } = await instance.post('/auth/register', userData);
      if (data) {
        const state = thunkAPI.getState();
        const { lang } = state.language.lang;
        lang === 'en'
          ? Notiflix.Notify.success(
              'Account was successfully created!',
              notifySettings
            )
          : Notiflix.Notify.success(
              'Акаунт успішно зареєстровано!',
              notifySettings
            );
        try {
          const results = await instance.post('/auth/login', userData);
          setToken(results.data.accessToken);
          return results.data;
        } catch (error) {
          return error;
        }
      }
    } catch (error) {
      const state = thunkAPI.getState();
      const { lang } = state.language.lang;

      if (error.request.status === 409) {
        lang === 'en'
          ? Notiflix.Notify.warning(
              `User with this email already exists`,
              notifySettings
            )
          : Notiflix.Notify.warning(
              `Користувач з цим емейлом вже реєструвався`,
              notifySettings
            );
        return thunkAPI.rejectWithValue(error.request.status);
      }
      lang === 'en'
        ? Notiflix.Notify.failure(`${error.message}`, notifySettings)
        : Notiflix.Notify.failure(`Щось пішло не так...`, notifySettings);
      return thunkAPI.rejectWithValue(error.request.status);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const { data } = await instance.post('/auth/login', userData);
      setToken(data.accessToken);
      const state = thunkAPI.getState();
      const { lang } = state.language.lang;
      lang === 'en'
        ? Notiflix.Notify.success(
            `Welcome back, ${data.userData.email}!`,
            notifySettings
          )
        : Notiflix.Notify.success(
            `Радо вітаємо, ${data.userData.email}!`,
            notifySettings
          );
      return data;
    } catch (error) {
      const state = thunkAPI.getState();
      const { lang } = state.language.lang;
      lang === 'en'
        ? Notiflix.Notify.failure(`${error.message}`, notifySettings)
        : Notiflix.Notify.failure(`Щось пішло не так...`, notifySettings);
      return thunkAPI.rejectWithValue(error.request.status);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await instance.post(`/auth/logout`);
      const state = thunkAPI.getState();
      const { lang } = state.language.lang;
      lang === 'en'
        ? Notiflix.Notify.info(
            'Stay safe and see you again &#9996;',
            notifySettings
          )
        : Notiflix.Notify.info(
            'Бережіть себе і до зустрічі &#9996;',
            notifySettings
          );
      setToken(null);
    } catch (error) {
      const state = thunkAPI.getState();
      const { lang } = state.language.lang;
      lang === 'en'
        ? Notiflix.Notify.failure(`${error.message}`, notifySettings)
        : Notiflix.Notify.failure(`Щось пішло не так...`, notifySettings);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// export const googleAuthUser = createAsyncThunk(
//   'auth/google',
//   async ({ accessToken, refreshToken, sid }, { rejectWithValue }) => {
//     setToken(accessToken);
//     try {
//       const { data } = await instance.get('/user');
//       return { accessToken, refreshToken, sid, data };
//     } catch ({ response }) {
//       const { status, data } = response;
//       const error = {
//         status,
//         message: data.message,
//       };
//       console.log(error);
//       return rejectWithValue(error);
//     }
//   }
// );

export const googleAuthUser = createAsyncThunk(
  'auth/google',
  async ({ accessToken, refreshToken, sid }) => {
    setToken(accessToken);
    try {
      const { data } = await instance.get('/user');
      return { accessToken, refreshToken, sid, data };
    } catch (error) {
      console.log(error);
    }
  }
);
