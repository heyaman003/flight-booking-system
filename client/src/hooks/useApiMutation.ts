import { useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/utils/fetch.utils';
import { toast } from 'sonner';

interface ApiMutationOptions {
  url: string;
  method?: 'POST' | 'PUT' | 'DELETE' | 'GET';
  headers?: Record<string, string>;
  data?: any;
  token?: string;
  refreshToken?: string;
}

export function useApiMutation() {
  return useMutation<any, Error, ApiMutationOptions>({
    mutationFn: async (options: ApiMutationOptions) => {
      const { url, method = 'POST', headers, data, token, refreshToken } = options;
      return fetchApi({
        url,
        method,
        data,
        token,
        refreshToken,
        // You can extend fetchApi to use headers if needed
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'API request failed. Please try again.');
    },
  });
}
