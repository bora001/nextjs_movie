import { AxiosError } from "axios";

export function getAxiosErrorMessage(
  error: unknown,
  fallback = "Server error occurred."
) {
  if ((error as AxiosError<{ message: string }>)?.response?.data?.message) {
    return (error as AxiosError<{ message: string }>).response!.data!.message;
  }
  return fallback;
}
