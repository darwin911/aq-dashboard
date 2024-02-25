import { AQ_INDEX } from "@/lib/shared";
import { MeasurementsResponse } from "@/lib/types";

export function getO3Index(data: MeasurementsResponse) {
  const avgLastEightHour =
    data.results.slice(0, 8).reduce((acc, result) => acc + result.value, 0) / 8;

  if (avgLastEightHour >= 0 && avgLastEightHour <= 0.054) {
    return AQ_INDEX.GOOD;
  } else if (avgLastEightHour >= 0.055 && avgLastEightHour <= 0.07) {
    return AQ_INDEX.MODERATE;
  } else if (avgLastEightHour >= 0.071 && avgLastEightHour <= 0.085) {
    return AQ_INDEX.UNHEALTHY_FOR_SENSITIVE;
  } else if (avgLastEightHour >= 0.071 && avgLastEightHour <= 0.085) {
    return AQ_INDEX.UNHEALTHY;
  } else if (avgLastEightHour >= 0.071 && avgLastEightHour <= 0.085) {
    return AQ_INDEX.VERY_UNHEALTHY;
  } else {
    return AQ_INDEX.HAZARDOUS;
  }
}
