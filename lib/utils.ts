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

export function getPM25orUM100(data: MeasurementsResponse) {
  const avgLastTwentyFourHour =
    data.results.slice(0, 24).reduce((acc, result) => acc + result.value, 0) /
    24;

  if (avgLastTwentyFourHour >= 0 && avgLastTwentyFourHour <= 12.0) {
    return AQ_INDEX.GOOD;
  } else if (avgLastTwentyFourHour >= 12.1 && avgLastTwentyFourHour <= 35.4) {
    return AQ_INDEX.MODERATE;
  } else if (avgLastTwentyFourHour >= 35.5 && avgLastTwentyFourHour <= 55.4) {
    return AQ_INDEX.UNHEALTHY_FOR_SENSITIVE;
  } else if (avgLastTwentyFourHour >= 55.5 && avgLastTwentyFourHour <= 150.4) {
    return AQ_INDEX.UNHEALTHY;
  } else if (avgLastTwentyFourHour >= 150.5 && avgLastTwentyFourHour <= 250.4) {
    return AQ_INDEX.VERY_UNHEALTHY;
  } else {
    return AQ_INDEX.HAZARDOUS;
  }
}

export function getPM10(data: MeasurementsResponse) {
  const avgLastTwentyFourHour =
    data.results.slice(0, 24).reduce((acc, result) => acc + result.value, 0) /
    24;

  if (avgLastTwentyFourHour >= 0 && avgLastTwentyFourHour <= 54) {
    return AQ_INDEX.GOOD;
  } else if (avgLastTwentyFourHour >= 55 && avgLastTwentyFourHour <= 154) {
    return AQ_INDEX.MODERATE;
  } else if (avgLastTwentyFourHour >= 155 && avgLastTwentyFourHour <= 254) {
    return AQ_INDEX.UNHEALTHY_FOR_SENSITIVE;
  } else if (avgLastTwentyFourHour >= 255 && avgLastTwentyFourHour <= 354) {
    return AQ_INDEX.UNHEALTHY;
  } else if (avgLastTwentyFourHour >= 355 && avgLastTwentyFourHour <= 424) {
    return AQ_INDEX.VERY_UNHEALTHY;
  } else {
    return AQ_INDEX.HAZARDOUS;
  }
}

export function getNO2orSO2(data: MeasurementsResponse) {
  const last = data.results[0];

  if (last.value >= 0 && last.value <= 53) {
    return AQ_INDEX.GOOD;
  } else if (last.value >= 54 && last.value <= 100) {
    return AQ_INDEX.MODERATE;
  } else if (last.value >= 101 && last.value <= 360) {
    return AQ_INDEX.UNHEALTHY_FOR_SENSITIVE;
  } else if (last.value >= 361 && last.value <= 649) {
    return AQ_INDEX.UNHEALTHY;
  } else if (last.value >= 650 && last.value <= 1249) {
    return AQ_INDEX.VERY_UNHEALTHY;
  } else {
    return AQ_INDEX.HAZARDOUS;
  }
}
