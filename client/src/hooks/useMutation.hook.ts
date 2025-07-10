import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/utils/fetch.utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
  postalCode?: string;
  phone?: string;
  country?: string;
  confirmPassword?: string;
}

type AuthType = 'login' | 'signup';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAuthMutation = (type: AuthType) => {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: AuthFormData) => {
      let { rememberMe, confirmPassword, postalCode, country, ...apiPayload } = formData; // exclude unwanted fields
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetchApi({
        url: `${BASE_URL}${endpoint}`,
        method: 'POST',
        data: apiPayload,
      });

      console.log(`Response from ${type} endpoint:`, res);

      return res;
    },
    onSuccess: (res) => {
      console.log(`${type} successful!`, res);
      
      if (type === 'signup') {
        toast.success('We have sent you an email verification. Please check your inbox to verify your account.');
      }
      
      if (type === 'login' && res?.data?.accessToken) {
        console.log('Login successful, setting auth state...');
        
        // Use the login function from auth context
        login(
          res.data.accessToken,
          res.data.refreshToken,
          res.data.user
        );
        
        // Get redirect URL from URL params or default to home
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || '/';
        console.log('Redirecting to:', redirectTo);
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push(redirectTo);
        }, 100);
      }
    },
    onError: (error: any) => {
      console.error(`${type} error:`, error.message);
      toast.error(error?.message || `${type} failed. Please try again.`);
    },
  });
};
