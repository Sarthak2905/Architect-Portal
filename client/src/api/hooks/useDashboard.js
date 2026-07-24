import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../axiosClient";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/dashboard/summary");
      return data.data;
    },
  });
};

export const usePendingPayments = (limit = 10) => {
  return useQuery({
    queryKey: ["dashboard", "pending-payments", limit],
    queryFn: async () => {
      const { data } = await axiosClient.get(
        `/dashboard/pending-payments?limit=${limit}`,
      );
      return data.data;
    },
  });
};

export const useRecentActivity = (limit = 15) => {
  return useQuery({
    queryKey: ["dashboard", "recent-activity", limit],
    queryFn: async () => {
      const { data } = await axiosClient.get(
        `/dashboard/recent-activity?limit=${limit}`,
      );
      return data.data;
    },
  });
};
