export const getUserID = () => {
  return localStorage.getItem("user_id");
};

export const getToken = () => {
  return localStorage.getItem("token");
};