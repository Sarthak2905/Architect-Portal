import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../axiosClient";

export const useProjects = ({
  search = "",
  status,
  client,
  page = 1,
  limit = 10,
  archived = "false",
}) => {
  return useQuery({
    queryKey: ["projects", { search, status, client, page, limit, archived }],
    queryFn: async () => {
      const { data } = await axiosClient.get("/projects", {
        params: { search, status, client, page, limit, archived },
      });
      return data.data; // { projects, pagination }
    },
    keepPreviousData: true,
  });
};

export const useProject = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/projects/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosClient.post("/projects", payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axiosClient.patch(`/projects/${id}`, payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axiosClient.patch(`/projects/${id}/status`, {
        status,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useArchiveProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosClient.delete(`/projects/${id}`);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useRestoreProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosClient.patch(`/projects/${id}/restore`);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};
