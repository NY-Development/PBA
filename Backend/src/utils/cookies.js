import { Env } from "../configs/env.js";

const refreshCookieOptions = {
    httpOnly: true,
    secure: Env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: Env.REFRESH_COOKIE_MAX_AGE
  };


const setRefreshToken = (res, token) => {
  res.cookie('refreshToken', token, refreshCookieOptions);
};

const clearRefreshToken = (res) => {
  res.clearCookie('refreshToken');
};


export const Cookie = {
  setRefreshToken,
  clearRefreshToken
}