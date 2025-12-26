import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { isProtected } from '../utils/protected';

// Fetch user from API
const fetchUser = async (isLoggedIn: boolean) => {
  const config = isLoggedIn ? isProtected : undefined;

  const response = await axiosInstance.get(`/api/logged-in-user`, config);
  return response.data.user;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "seller";
  password?: string;
  following?: string[];
  createdAt?: string;
  updatedAt?: string;
  avatar: { fileUrl: string; fileId: string }[];
};


const useUser = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuthStore();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchUser(isLoggedIn),
    staleTime: 1000 * 60 * 5,
    retry: false,
    // @ts-ignore
    onSuccess: () => setIsLoggedIn(true),
    onError: () => setIsLoggedIn(false),
  });
  return { user: user as User, isLoading, isError };
};

export default useUser;
