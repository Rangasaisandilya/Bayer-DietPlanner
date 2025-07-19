import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../axios/axiosinstance';
import type { Book } from '../types/books';

export const useBooks = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['books', page, limit],
    queryFn: async () => {
      const response = await api.get<Book[]>(`/books?_start=${page}&_limit=${limit}`);
      // const response = await api.get<Book[]>(`/books?_page=${page}&_limit=${limit}`);
      return response;
    }
  });
};

export const useAddBook = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: Omit<Book, 'id'>) => {
      const newBook = { ...book, id: Date.now().toString() };
      await api.post('/books', newBook);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      onSuccess?.();
    },
  });
};

export const useEditBook = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: Book) => {
      const { id, ...rest } = book;
      await api.put(`/books/${id}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      onSuccess?.();
    },
  });
};
