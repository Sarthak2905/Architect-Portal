import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../axiosClient";

// Portal calls never send an Authorization header — the token is
// embedded in the URL path itself, matching the backend's
// resolvePortalProject middleware.
export const usePortalOverview = (token) => {
  return useQuery({
    queryKey: ["portal", token, "overview"],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/portal/${token}/overview`);
      return data.data;
    },
    enabled: !!token,
    retry: false, // a bad/expired token shouldn't keep retrying
  });
};

export const usePortalTimeline = (token) => {
  return useQuery({
    queryKey: ["portal", token, "timeline"],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/portal/${token}/timeline`);
      return data.data;
    },
    enabled: !!token,
  });
};

export const usePortalDocuments = (token) => {
  return useQuery({
    queryKey: ["portal", token, "documents"],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/portal/${token}/documents`);
      return data.data;
    },
    enabled: !!token,
  });
};

export const usePortalPhotos = (token) => {
  return useQuery({
    queryKey: ["portal", token, "photos"],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/portal/${token}/photos`);
      return data.data;
    },
    enabled: !!token,
  });
};

export const usePortalPayments = (token) => {
  return useQuery({
    queryKey: ["portal", token, "payments"],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/portal/${token}/payments`);
      return data.data;
    },
    enabled: !!token,
  });
};
