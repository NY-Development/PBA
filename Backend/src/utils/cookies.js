import { Env } from "../config/env";

const accessCookieOptions = {
    httpOnly: true,
    secure: Env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: Env.ACCESS_COOKIE_MAX_AGE
  };
  
const refreshCookieOptions = {
    httpOnly: true,
    secure: Env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: Env.REFRESH_COOKIE_MAX_AGE
  };


const setAccessToken = (res, token) => {
  res.cookie('accessToken', token, accessCookieOptions);
};

const clearAccessToken = (res) => {
  res.clearCookie('accessToken');
};

const setRefreshToken = (res, token) => {
  res.cookie('refreshToken', token, refreshCookieOptions);
};

const clearRefreshToken = (res) => {
  res.clearCookie('refreshToken');
};


export const Cookie = {
  setAccessToken,
  setRefreshToken,
  clearAccessToken,
  clearRefreshToken
}