import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../axiosClient";

export const useProjectUpdates = (projectId) => {
  return useQuery({
    queryKey: ["updates", projectId],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/projects/${projectId}/updates`, {
        params: { order: "desc", limit: 50 },
      });
      return data.data; // { updates, pagination }
    },
    enabled: !!projectId,
  });
};

export const useCreateUpdate = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosClient.post(
        `/projects/${projectId}/updates`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["updates", projectId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
