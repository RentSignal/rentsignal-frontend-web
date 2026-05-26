import { useEffect, useState } from "react";
import {
  fetchConsumerIndex,
  type ConsumerIndexData,
  type ConsumerIndexPeriodType,
} from "@/services/infoApi";
import { useMapOverlayStore } from "@/store/mapOverlayStore";

type UseConsumerIndexParams = {
  isActive: boolean;
  periodType: ConsumerIndexPeriodType;
};

export const useConsumerIndex = ({
  isActive,
  periodType,
}: UseConsumerIndexParams) => {
  const [data, setData] = useState<ConsumerIndexData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const setConsumerIndexMapItem = useMapOverlayStore(
    (state) => state.setConsumerIndexItem,
  );
  const clearConsumerIndexMapItem = useMapOverlayStore(
    (state) => state.clearConsumerIndexItem,
  );

  useEffect(() => {
    if (!isActive) {
      clearConsumerIndexMapItem();
      return;
    }

    const controller = new AbortController();

    const fetchIndex = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const selectedIndexPromise = fetchConsumerIndex(periodType);
        const currentIndexPromise =
          periodType === "CURRENT"
            ? selectedIndexPromise
            : fetchConsumerIndex("CURRENT");
        const [selectedData, currentData] = await Promise.all([
          selectedIndexPromise,
          currentIndexPromise,
        ]);

        if (!controller.signal.aborted) {
          setData(selectedData);
          setConsumerIndexMapItem({
            year: currentData.year,
            month: currentData.month,
            value: currentData.value,
          });
        }
      } catch {
        if (!controller.signal.aborted) {
          setErrorMessage("소비자 심리지수 데이터를 불러오지 못했습니다.");
          setData(null);
          clearConsumerIndexMapItem();
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchIndex();

    return () => controller.abort();
  }, [
    clearConsumerIndexMapItem,
    isActive,
    periodType,
    setConsumerIndexMapItem,
  ]);

  useEffect(() => {
    return () => clearConsumerIndexMapItem();
  }, [clearConsumerIndexMapItem]);

  return {
    data,
    isLoading,
    errorMessage,
  };
};
