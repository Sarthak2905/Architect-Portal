import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../axiosClient";

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ username, password }) => {
      const { data } = await axiosClient.post("/auth/login", {
        username,
        password,
      });
      return data.data; // { accessToken, user }
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await axiosClient.post("/auth/logout");
    },
  });
};

export const useMe = () => {
  return async () => {
    const { data } = await axiosClient.get("/auth/me");
    return data.data;
  };
};

export const useUpdateCredentials = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosClient.patch("/auth/credentials", payload);
      return data.data;
    },
  });
};
