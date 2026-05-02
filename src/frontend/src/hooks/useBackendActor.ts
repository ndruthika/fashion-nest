import { useActor } from "@caffeineai/core-infrastructure";
import { type Backend, createActor } from "../backend";

export function useBackendActor() {
  const { actor, isFetching } = useActor(createActor);
  return { actor: actor as Backend | null, isFetching };
}
