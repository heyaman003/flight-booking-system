import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/utils/fetch.utils';

export function useUserProfile() {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
          const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '';
          const res = await fetchApi({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
            method: 'GET',
            token: accessToken,
          });
          if (!res.success) throw new Error(res.message || 'Failed to fetch user profile');
          return res.data;
        },
        staleTime: 0, // always fetch fresh
      });
}