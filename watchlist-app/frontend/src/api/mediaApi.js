import axiosClient from "./axiosClient.js";

export async function fetchMedia(statusFilter) {
  const params = statusFilter ? { status: statusFilter } : {};
  const { data } = await axiosClient.get("/media/", { params });
  return data;
}

export async function createMedia({ title, type }) {
  const { data } = await axiosClient.post("/media/", {
    title,
    type,
    status: "UNWATCHED",
  });
  return data;
}

export async function updateRating(id, rating) {
  const { data } = await axiosClient.patch(`/media/${id}/`, { rating });
  return data;
}

export async function deleteMedia(id) {
  await axiosClient.delete(`/media/${id}/`);
}
