import { useMutation } from "@tanstack/react-query";
import { registerFn } from "../api/mutations/auth.mutation";

export const useRegister = (
  onSuccess?: () => void,
  onError?: (err: any) => void
) => {
  return useMutation({
    mutationFn: registerFn,
    onSuccess,
    onError,
  });
};
