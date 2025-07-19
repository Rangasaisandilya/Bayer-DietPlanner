import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../axios/axiosinstance';
import type { Ambulance } from '../types/ambulance';

interface AmbulanceApiResponse {
  ambulances: Ambulance[];
  total: number;
}

export const useAmbulances = (page?: number, limit?: number, query: string = '') => {
  return useQuery({
    queryKey: ['ambulances', page, limit, query],
    queryFn: async () => {
      const response = await api.get<AmbulanceApiResponse>(`/api/ambulance/ambulances?page=${page}&limit=${limit}&search=${query}`);
      return response.data
    }
  });
};

export const useAddAmbulance = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ambulance: Omit<Ambulance, '_id'>) => {
      await api.post('/api/ambulance/add-ambulance', ambulance);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
      onSuccess?.();
    },
  });
};

export const useEditAmbulance = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ambulance: Ambulance) => {
      const { _id, ...rest } = ambulance;
      await api.put(`/api/ambulance/ambulance/${_id}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
      onSuccess?.();
    },
  });
};

export const useDeleteAmbulance = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ambulanceId: string) => {
      await api.delete(`/api/ambulance/ambulance/${ambulanceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
      onSuccess?.();
    },
  });
};