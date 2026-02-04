import api from "./axios";

export const testBackend = () => {
  return api.get("/"); 
};
