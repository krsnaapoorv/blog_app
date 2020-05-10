export const LOGIN = "LOGIN"
export const SIGNOUT = "SIGNOUT"

export const login = items => ({
    type: LOGIN,
    payload: items
});
  
export const signout = items => ({
    type: SIGNOUT,
    payload: items
});