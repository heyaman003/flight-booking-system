'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useAuthMutation } from '@/hooks/useMutation.hook'; // adjust path
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Eye, EyeOff, Plane, Mail, Lock, User, Phone, Calendar, MapPin
} from 'lucide-react';

// Zod Schemas
const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional()
});

const SignupSchema = LoginSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Types
type LoginFormData = z.infer<typeof LoginSchema>;
type SignupFormData = z.infer<typeof SignupSchema>;

// ----- Login Form -----
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const { mutate: login } = useAuthMutation('login');

  const onSubmit = (data: LoginFormData) => login(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            {...register('email')}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            placeholder="john@example.com"
          />
        </div>
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type={showPassword ? "text" : "password"}
            {...register('password')}
            className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded focus:ring-blue-400 focus:ring-2"
          />
          <span className="ml-2 text-white/80 text-sm">Remember me</span>
        </label>
        <button
          type="button"
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Signing In...
          </div>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="text-center">
        <p className="text-white/70">
          Don't have an account?
          <button
            type="button"
            onClick={onSwitch}
            className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors"
          >
            Sign Up
          </button>
        </p>
      </div>
    </form>
  );
}

// ----- Signup Form -----
function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      postalCode: '',
      country: '',
      rememberMe: false
    }
  });

  const { mutate: signup } = useAuthMutation('signup');

  const onSubmit = (data: SignupFormData) => signup(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              {...register('firstName')}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              placeholder="John"
            />
          </div>
          {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              {...register('lastName')}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              placeholder="Doe"
            />
          </div>
          {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            {...register('email')}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            placeholder="john@example.com"
          />
        </div>
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            {...register('phone')}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Postal Code</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              {...register('postalCode')}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              placeholder="12345"
            />
          </div>
          {errors.postalCode && <p className="text-red-400 text-sm mt-1">{errors.postalCode.message}</p>}
        </div>
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Country</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <select
              {...register('country')}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            >
              <option value="" className="bg-gray-800">Select Country</option>
              <option value="US" className="bg-gray-800">United States</option>
              <option value="CA" className="bg-gray-800">Canada</option>
              <option value="UK" className="bg-gray-800">United Kingdom</option>
              <option value="AU" className="bg-gray-800">Australia</option>
              <option value="DE" className="bg-gray-800">Germany</option>
              <option value="FR" className="bg-gray-800">France</option>
              <option value="IN" className="bg-gray-800">India</option>
              <option value="JP" className="bg-gray-800">Japan</option>
            </select>
          </div>
          {errors.country && <p className="text-red-400 text-sm mt-1">{errors.country.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type={showPassword ? "text" : "password"}
            {...register('password')}
            className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register('confirmPassword')}
            className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Creating Account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>

      <div className="text-center">
        <p className="text-white/70">
          Already have an account?
          <button
            type="button"
            onClick={onSwitch}
            className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
}

// ----- Main Auth Page -----
function AuthPageContent() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // If already authenticated, redirect to the intended page
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Branding */}
            <div className="lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-white/10 to-transparent flex flex-col justify-center">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <Plane className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white ml-3">
                    SkyConnect
                  </h1>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {isLogin ? 'Welcome Back!' : 'Join SkyConnect'}
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  {isLogin
                    ? 'Sign in to access your flight bookings and manage your travel plans.'
                    : 'Create your account and start exploring the world with exclusive flight deals.'}
                </p>
                <div className="hidden lg:block">
                  <div className="space-y-4">
                    <div className="flex items-center text-white/80">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <span>Book flights to 500+ destinations</span>
                    </div>
                    <div className="flex items-center text-white/80">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <span>24/7 customer support</span>
                    </div>
                    <div className="flex items-center text-white/80">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <span>Exclusive member discounts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right side - Form */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </h3>
                  <p className="text-white/70">
                    {isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
                  </p>
                </div>
                {isLogin
                  ? <LoginForm onSwitch={() => setIsLogin(false)} />
                  : <SignupForm onSwitch={() => setIsLogin(true)} />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
