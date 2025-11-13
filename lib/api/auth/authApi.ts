import { CONFIG } from "@/config/config";
import { API } from "@/constants";
import axios from "axios";

export async function fetchLogin(body: string) {
  try {
    const response = await axios.post(
      `${CONFIG.APP_URL}${API.ROUTES.API.AUTH.LOGIN}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching login:", error);
    throw error;
  }
}

export async function fetchSendVerification(body: string) {
  try {
    const response = await axios.post(
      `${CONFIG.APP_URL}${API.ROUTES.API.AUTH.SEND_VERIFICATION_CODE}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching send verification:", error);
    throw error;
  }
}
export async function fetchVerifyCode(body: string) {
  try {
    const response = await axios.post(
      `${CONFIG.APP_URL}${API.ROUTES.API.AUTH.VERIFY_CODE}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching verify code:", error);
    throw error;
  }
}
export async function fetchVerifyEmail(token: string) {
  try {
    const response = await axios.get(
      `${CONFIG.APP_URL}${API.ROUTES.API.AUTH.VERIFY_EMAIL}?token=${token}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching verify code:", error);
    throw error;
  }
}
export async function fetchRegisterUser(body: string) {
  try {
    const response = await axios.post(
      `${CONFIG.APP_URL}${API.ROUTES.API.AUTH.REGISTER}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching register user:", error);
    throw error;
  }
}
export async function fetchChangeName(body: string) {
  try {
    const response = await axios.post(
      `${CONFIG.APP_URL}${API.ROUTES.API.AUTH.CHANGE_NAME}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching change user's name:", error);
    throw error;
  }
}
export async function fetchChangePassword(body: string) {
  try {
    const response = await axios.post(
      `${CONFIG.APP_URL}${API.ROUTES.API.AUTH.CHANGE_PASSWORD}`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching change user's password:", error);
    throw error;
  }
}

export async function fetchLogout() {
  try {
    const response = await axios.post(
      `${CONFIG.APP_URL}${API.ROUTES.API.AUTH.LOGOUT}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching logout:", error);
    throw error;
  }
}

export async function fetchUserInfo() {
  try {
    const response = await axios.get(
      `${CONFIG.APP_URL}${API.ROUTES.API.AUTH.ME}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching logout:", error);
    throw error;
  }
}
