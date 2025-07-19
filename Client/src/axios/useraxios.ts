import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./axiosinstance";
import type { UserState } from "../redux/userslice";
// import { Shift } from '../types/attendence';

interface IUser {
  _id: string;
  username: string;
  email: string;
  contactNumber: string;
  role: string;
  shiftStart: string;
  shiftEnd: string;
  address: string;
  gender: string;
  isAvailable: boolean;
  lastUpdated: string;
  createdAt?: string;
  updatedAt?: string;
  total?: string | number | null;
  deleted?: boolean;
  profilePicture?: File | null | string;
}

interface GetUsersResponse {
  data: IUser[];
  total: number;
}

export const useGetAllUsers = (
  page: number,
  limit: number,
  search: string,
  role: string,
  deleted: boolean,
  department:string
) => {
  return useQuery<GetUsersResponse>({
    queryKey: ["user", page, limit, search, role, deleted,department],
    queryFn: async () => {
      const response = await api.get<GetUsersResponse>(
        `/api/user/getallusers?page=${page}&limit=${limit}&search=${search}&role=${role}&deleted=${deleted}&department=${department}`
      );
      const respData = response.data;
      return {
        data: respData?.data ?? [],
        total: respData?.total ?? 0
      };
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async ({
      userId,
      deleted,
    }: {
      userId: string;
      deleted: boolean;
    }) => {
      const response = await api.post(
        `/api/user/delete-user/${userId}/${deleted}`
      );
      return response.data;
    },
  });
};

export const useCurrentUser = () => {
  return useMutation<UserState, Error, string>({
    mutationFn: async (userId: string): Promise<UserState> => {
      try {
        const response = await api.get(`/api/user/getcurrentuser/${userId}`);
        return response.data as UserState;
      } catch (error: unknown) {
        console.error("Error fetching user:", error);
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: unknown }).response === "object" &&
          (error as { response?: object }).response !== null &&
          "data" in (error as { response?: { data?: unknown } }).response! &&
          typeof (error as { response?: { data?: object } }).response!.data === "object" &&
          (error as { response?: { data?: object } }).response!.data !== null &&
          "message" in (error as { response?: { data?: { message?: unknown } } }).response!.data! &&
          typeof (error as { response?: { data?: { message?: string } } }).response!.data!.message === "string"
        ) {
          throw new Error((error as { response: { data: { message: string } } }).response.data.message);
        } else {
          throw new Error("Failed to fetch user");
        }
      }
    },
  });
};

export interface StaffHistoryItem {
  _id: string;
  userId: {
    username: string;
    email: string;
  };
  previousShiftStart: string;
  previousShiftEnd: string;
  newShiftStart: string;
  newShiftEnd: string;
  createdAt: string;
}

export interface StaffHistoryResponse {
  data: StaffHistoryItem[];
  total: number;
}

export const useStaffHistory = (
  page: number,
  limit: number,
  search: string,
  sortBy?: string,
  order?: "asc" | "desc"
) => {
  return useQuery<StaffHistoryResponse>({
    queryKey: ["staff-history", page, limit, search, sortBy, order],
    queryFn: async () => {
      const response = await api.get<StaffHistoryResponse>(
        `/api/user/staff-history?page=${page}&limit=${limit}&search=${search}&sortBy=${
          sortBy ?? ""
        }&order=${order ?? ""}`
      );
      return response.data ?? { data: [], total: 0 };
    },
  });
};

export interface StaffEventLog {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  staffHistoryId?: {
    userId: {
      username: string;
      email: string;
    };
    newShiftStart: string;
    newShiftEnd: string;
  };
  emergencyCaseId?: {
    caseType: string;
    description: string;
  };
}

export interface StaffEventLogResponse {
  data: StaffEventLog[];
  total: number;
}

export const useStaffEventLogs = (
  page: number,
  limit: number,
  search: string,
  sortBy?: string,
  order?: "asc" | "desc",
  role?: string,
  userId?: string
) => {
  return useQuery<StaffEventLogResponse>({
    queryKey: [
      "staff-event-logs",
      page,
      limit,
      search,
      sortBy,
      order,
      role,
      userId,
    ],
    queryFn: async () => {
      const response = await api.get<StaffEventLogResponse>(
        `/api/user/staff-event-logs?page=${page}&limit=${limit}&search=${search}&sortBy=${
          sortBy ?? ""
        }&role=${role ?? ""}&userId=${userId ?? ""}`
      );
      return response.data ?? { data: [], total: 0 };
    },
  });
};

// export const useShifts = (role: 'Admin' | 'User', userId?: string) => {
//   return useQuery<Shift[]>({
//     queryKey: ['shifts', role, userId],
//     queryFn: async (): Promise<Shift[]> => {
//       const url = role === 'Admin' ? '/api/shifts' : `/api/shifts/user/${userId}`;
//       const res = await api.get<Shift[]>(url);
//       return res.data;
//     },
//   });
// };


