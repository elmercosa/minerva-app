import { useQuery } from "react-query";

import { getUser } from "@/services/userService";

export default function useUser() {
  const User = useQuery({
    queryKey: "user",
    queryFn: () => getUser(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return User;
}
