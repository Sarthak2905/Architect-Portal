import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../axiosClient";

export const useProjectPayments = (projectId) => {
  return useQuery({
    queryKey: ["payments", projectId],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/projects/${projectId}/payments`);
      return data.data; // { payments, summary }
    },
    enabled: !!projectId,
  });
};

export const useCreatePayment = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosClient.post(
        `/projects/${projectId}/payments`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", projectId] });
      queryClient.invalidateQueries({ queryKey: ["updates", projectId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeletePayment = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentId) => {
      const { data } = await axiosClient.delete(`/payments/${paymentId}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", projectId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useSendPaymentReminder = (projectId) => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosClient.post(
        `/projects/${projectId}/notifications/payment-reminder`,
      );
      return data.data;
    },
  });
};
