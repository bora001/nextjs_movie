import { CONSTANTS } from "@/constants/constants";
import { NextResponse } from "next/server";

export const jsonResponse = <T>({
  success,
  message,
  status,
  data,
}: {
  success: boolean;
  message: string;
  status: number;
  data?: T;
}) => {
  const response: { success: boolean; message: string; data?: T } = {
    success,
    message,
  };
  if (data !== undefined) response.data = data;

  return NextResponse.json(response, { status });
};

export const successResponse = <T>({
  message,
  status = CONSTANTS.STATUS_CODES.OK,
  data,
}: {
  message: string;
  status: number;
  data?: T;
}) => {
  return jsonResponse({ success: true, message, status, data });
};

export const errorResponse = ({
  message,
  status = CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR,
}: {
  message: string;
  status: number;
}) => {
  return jsonResponse({ success: false, message, status });
};
