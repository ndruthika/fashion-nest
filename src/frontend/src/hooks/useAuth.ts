import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "../types";
import { useBackendActor } from "./useBackendActor";

function mapProfile(raw: Record<string, unknown>): UserProfile {
  return {
    principal: String(raw.principal ?? ""),
    displayName: String(raw.displayName ?? ""),
    email: String(raw.email ?? ""),
    phone: String(raw.phone ?? ""),
    avatarUrl: String(raw.avatarUrl ?? ""),
    savedAddresses: (raw.savedAddresses as UserProfile["savedAddresses"]) ?? [],
    wishlist: (raw.wishlist as bigint[]) ?? [],
    isAdmin: Boolean(raw.isAdmin ?? false),
    createdAt: BigInt(String(raw.createdAt ?? 0)),
  };
}

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();
  const { actor, isFetching } = useBackendActor();
  const queryClient = useQueryClient();

  const isAuthenticated = loginStatus === "success";

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ["profile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return null;
      try {
        const result = await (
          actor as unknown as Record<
            string,
            (...args: unknown[]) => Promise<unknown>
          >
        ).getCallerUserProfile();
        if (!result) return null;
        return mapProfile(result as Record<string, unknown>);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (profile: Partial<UserProfile>) => {
      if (!actor) throw new Error("Not connected");
      await (
        actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >
      ).saveCallerUserProfile(profile);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  const handleLogout = () => {
    clear();
    queryClient.clear();
  };

  return {
    identity,
    loginStatus,
    login,
    logout: handleLogout,
    isAuthenticated,
    profile: profileQuery.data ?? null,
    isAdmin: profileQuery.data?.isAdmin ?? false,
    isLoadingProfile: profileQuery.isLoading,
    saveProfile: saveProfileMutation.mutateAsync,
  };
}
