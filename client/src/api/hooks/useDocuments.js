import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../axiosClient";

export const useProjectDocuments = (projectId, type) => {
  return useQuery({
    queryKey: ["documents", projectId, type],
    queryFn: async () => {
      const { data } = await axiosClient.get(
        `/projects/${projectId}/documents`,
        {
          params: type ? { type } : {},
        },
      );
      return data.data; // array
    },
    enabled: !!projectId,
  });
};

export const useUploadDocument = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosClient.post(
        `/projects/${projectId}/documents`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
      queryClient.invalidateQueries({ queryKey: ["updates", projectId] });
    },
  });
};

export const useDeleteDocument = (projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentId) => {
      const { data } = await axiosClient.delete(`/documents/${documentId}`);
      return data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] }),
  });
};
