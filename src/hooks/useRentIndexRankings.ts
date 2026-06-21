import { useEffect, useState } from "react";
import {
  fetchRentIndexChangeRankings,
  fetchRentIndexRankings,
  type HousingType,
  type RentIndexChangeRankings,
  type RentIndexPeriodType,
  type RentIndexRankingItem,
} from "@/services/infoApi";
import { useMapOverlayStore } from "@/store/mapOverlayStore";
import type { RentIndexMapOverlayType } from "@/store/mapOverlayStore";

type UseRentIndexRankingsParams = {
  isActive: boolean;
  residenceType: HousingType;
  periodType: RentIndexPeriodType;
};

const emptyChangeRankings: RentIndexChangeRankings = {
  rise: [],
  fall: [],
};

export const useRentIndexRankings = ({
  isActive,
  residenceType,
  periodType,
}: UseRentIndexRankingsParams) => {
  const [changeRankings, setChangeRankings] =
    useState<RentIndexChangeRankings>(emptyChangeRankings);
  const [currentRankings, setCurrentRankings] = useState<
    RentIndexRankingItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const setRentIndexMapItems = useMapOverlayStore(
    (state) => state.setRentIndexItems,
  );
  const clearRentIndexMapItems = useMapOverlayStore(
    (state) => state.clearRentIndexItems,
  );
  const selectRentIndexMapItem = useMapOverlayStore(
    (state) => state.selectRentIndexItem,
  );

  useEffect(() => {
    if (!isActive) {
      clearRentIndexMapItems();
      return;
    }

    const controller = new AbortController();

    const fetchRankings = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        if (periodType === "CURRENT") {
          const rankings = await fetchRentIndexRankings(residenceType);

          if (!controller.signal.aborted) {
            setCurrentRankings(rankings);
            setChangeRankings(emptyChangeRankings);
            setRentIndexMapItems(
              rankings.map((item) => ({ ...item, type: "CURRENT" })),
            );
          }

          return;
        }

        const rankings = await fetchRentIndexChangeRankings({
          housingType: residenceType,
          periodType,
        });

        if (!controller.signal.aborted) {
          setChangeRankings(rankings);
          setCurrentRankings([]);
          setRentIndexMapItems([
            ...rankings.rise.map((item) => ({ ...item, type: "RISE" as const })),
            ...rankings.fall.map((item) => ({ ...item, type: "FALL" as const })),
          ]);
        }
      } catch {
        if (!controller.signal.aborted) {
          setErrorMessage("랭킹 데이터를 불러오지 못했습니다.");
          setChangeRankings(emptyChangeRankings);
          setCurrentRankings([]);
          clearRentIndexMapItems();
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchRankings();

    return () => controller.abort();
  }, [
    clearRentIndexMapItems,
    isActive,
    periodType,
    residenceType,
    setRentIndexMapItems,
  ]);

  useEffect(() => {
    return () => clearRentIndexMapItems();
  }, [clearRentIndexMapItems]);

  const selectMapItem = (
    item: RentIndexRankingItem,
    type: RentIndexMapOverlayType,
  ) => {
    selectRentIndexMapItem({ ...item, type });
  };

  return {
    changeRankings,
    currentRankings,
    isLoading,
    errorMessage,
    selectMapItem,
  };
};
