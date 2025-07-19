import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../axios/axiosinstance';
import type { IEmergencyCase } from '../types/emergencyCase';

interface EmergencyCaseApiResponse {
  emergencyCases: IEmergencyCase[];
  total: number;
}

export const useEmergencyCases = (page = 1, limit = 10, query = '') => {
  return useQuery({
    queryKey: ['emergencyCases', page, limit, query],
    queryFn: async () => {
      const response = await api.get<EmergencyCaseApiResponse>(
        `/api/emergency-cases/emergencyCases?page=${page}&limit=${limit}&search=${query}`
      );
      return response.data;
    },
  });
};

export const useAddEmergencyCase = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emergencyCase: Omit<IEmergencyCase, '_id'>) => {
      await api.post('/api/emergency-cases/add-emergencyCase', emergencyCase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyCases'] });
      onSuccess?.();
    },
  });
};

export const useEditEmergencyCase = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emergencyCase: IEmergencyCase) => {
      const { _id, ...rest } = emergencyCase;
      await api.put(`/api/emergency-cases/emergencyCase/${_id}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyCases'] });
      onSuccess?.();
    },
  });
};

export const useDeleteEmergencyCase = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/emergency-cases/emergencyCase/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergencyCases'] });
      onSuccess?.();
    },
  });
};

export const useEmergencyCaseById = (id: string) => {
  return useQuery({
    queryKey: ['emergencyCase', id],
    queryFn: async () => {
      const response = await api.get<IEmergencyCase>(`/api/emergency-cases/emergencyCase/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
