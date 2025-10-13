import { useQuery } from "@tanstack/react-query";
import { fetchUserInsights } from "@/api/users";

export function useUserInsights(options = {}) {
  return useQuery({
    queryKey: ["userInsights"],
    queryFn: fetchUserInsights,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    ...options,
  });
}