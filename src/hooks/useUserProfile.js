import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/api/users";

export function useUserProfile(options = {}) {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    ...options,
  });
}