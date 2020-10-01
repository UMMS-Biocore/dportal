/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
export const login = async (emailOrUsername, password) => {
  try {
    const data = { password };
    if (emailOrUsername.match(/@/)) {
      data.email = emailOrUsername;
    } else {
      data.username = emailOrUsername;
    }
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    location.assign('/api/v1/users/logout');
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
