import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { minutesToMilliseconds } from "date-fns";

import { fetcher } from "@/lib/utils";
import { ExtendedMatch } from "@/data/getClubMatches";

export type Options = Pick<UseQueryOptions, "enabled">;

export interface ClubMatchesResponse {
  matches: ExtendedMatch[];
  hasMorePrevious: boolean;
  hasMoreNext: boolean;
}

export const QUERY_CONFIG = {
  UseClubMatches: (
    clubId: number,
    page: number,
    finishedMatchesCount: number,
    pageSize: number,
    options?: Options,
  ) => ({
    ...options,
    queryKey: ["clubMatches", clubId, page],
    queryFn: () =>
      fetcher<ClubMatchesResponse>(
        `/api/club/${clubId}/matches?page=${page}&pageSize=${pageSize}&finishedMatchesCount=${finishedMatchesCount}`,
      ),
    staleTime: minutesToMilliseconds(1),
  }),
} satisfies Record<string, (...args: never[]) => UseQueryOptions>;

export const useClubMatches = (
  clubId: number,
  page: number = 0,
  finishedMatchesCount: number = 3,
  pageSize: number = 7,
  options?: Options,
) =>
  useQuery(
    QUERY_CONFIG.UseClubMatches(
      clubId,
      page,
      finishedMatchesCount,
      pageSize,
      options,
    ),
  );
