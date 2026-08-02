import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../axiosClient";

export const useClients = ({
  search = "",
  page = 1,
  limit = 10,
  status = "active",
}) => {
  return useQuery({
    queryKey: ["clients", { search, page, limit, status }],
    queryFn: async () => {
      const { data } = await axiosClient.get("/clients", {
        params: { search, page, limit, status },
      });
      return data.data; // { clients, pagination }
    },
    keepPreviousData: true,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosClient.post("/clients", payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axiosClient.patch(`/clients/${id}`, payload);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
};

export const useDeactivateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosClient.delete(`/clients/${id}`);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
};

export const useReactivateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosClient.patch(`/clients/${id}/reactivate`);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
};

export const useHardDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosClient.delete(`/clients/${id}/permanent`);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
};