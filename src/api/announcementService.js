import apiPublic from "./axiosPublic";


export const getAnnouncements = async (url = "/announcements/", search = "") => {
  let finalUrl = url;
 
  if (search && !url.includes("?")) {
    finalUrl = `${url}?search=${encodeURIComponent(search)}`;
  } else if (search && url.includes("?")) {
    // If we are using a pagination URL that already has params, append the search
    finalUrl = `${url}&search=${encodeURIComponent(search)}`;
  }

  const response = await apiPublic.get(finalUrl);
  return response.data;
};

export const getAnnouncementById = async (id) => {
  const response = await apiPublic.get(`/announcements/${id}/`);
  return response.data;
};