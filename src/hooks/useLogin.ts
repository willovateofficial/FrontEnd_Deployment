import { useMutation } from "@tanstack/react-query";
import { loginFn } from "../api/mutations/auth.mutation";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      // Save token on success
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("plan_status", data.plan_status);
      localStorage.setItem("buisiness_name", data.user.business.name);
      localStorage.setItem("businessId", data.user.business.id);
      localStorage.setItem("logo", data.user.business.logo);
    },
  });
};
