import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../axios/axiosinstance';
import type { TrainingSessionForm } from '../types/trainingSession';

interface TrainingSessionApiResponse {
  trainingSessions: TrainingSessionForm[];
  total: number;
}

export const useTrainingSessions = (page?: number, limit?: number, query: string = '') => {
  return useQuery({
    queryKey: ['trainingSessions', page, limit, query],
    queryFn: async () => {
      const response = await api.get<TrainingSessionApiResponse>(
        `/api/training?page=${page}&limit=${limit}&search=${query}`
      );
      console.log(response.data);
      
      return response.data;
    },
  });
};

export const useAddTrainingSession = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: Omit<TrainingSessionForm, '_id'>) => {
        console.log(session);
        
      await api.post('/api/training', session);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      onSuccess?.();
    },
  });
};

export const useEditTrainingSession = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: TrainingSessionForm) => {
      const { _id, ...rest } = session;
      await api.put(`/api/training/${_id}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      onSuccess?.();
    },
  });
};

