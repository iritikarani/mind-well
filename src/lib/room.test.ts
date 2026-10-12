import { describe, expect, it } from "vitest";
import {
  greetingFor,
  lampGlow,
  plantStage,
  roomDim,
  skyTimeFor,
  timeOfDayFromHour,
  weatherForMood,
  weatherLine,
} from "./room";

const MOODS = ["Happy", "Okay", "Calm", "Neutral", "Low", "Upset", "Tired", "Unsure"];

describe("timeOfDayFromHour", () => {
  it("maps every hour of the day to a sensible phase", () => {
    expect(timeOfDayFromHour(4)).toBe("night");
    expect(timeOfDayFromHour(5)).toBe("dawn");
    expect(timeOfDayFromHour(7)).toBe("dawn");
    expect(timeOfDayFromHour(8)).toBe("day");
    expect(timeOfDayFromHour(16)).toBe("day");
    expect(timeOfDayFromHour(17)).toBe("dusk");
    expect(timeOfDayFromHour(19)).toBe("dusk");
    expect(timeOfDayFromHour(20)).toBe("night");
    expect(timeOfDayFromHour(0)).toBe("night");
  });
});

describe("weatherForMood", () => {
  it("rains (cozily) on hard days and never on bright ones", () => {
    expect(weatherForMood("Low").rain).toBe(true);
    expect(weatherForMood("Upset").rain).toBe(true);
    for (const m of ["Happy", "Calm", "Okay", "Neutral", "Tired", "Unsure", null]) {
      expect(weatherForMood(m).rain).toBe(false);
    }
  });
  it("only a happy day has sparkles and birds; only 'unsure' has mist", () => {
    expect(weatherForMood("Happy")).toMatchObject({ sparkles: true, birds: true });
    expect(weatherForMood("Unsure").mist).toBe(true);
    expect(weatherForMood("Calm").mist).toBe(false);
  });
  it("has a gentle line for every mood and for none", () => {
    for (const m of [...MOODS, null]) expect(weatherLine(m).length).toBeGreaterThan(20);
  });
});

describe("skyTimeFor", () => {
  it("brings the evening light early when tired, otherwise leaves the time alone", () => {
    expect(skyTimeFor("day", "Tired")).toBe("dusk");
    expect(skyTimeFor("dawn", "Tired")).toBe("dusk");
    expect(skyTimeFor("night", "Tired")).toBe("night");
    expect(skyTimeFor("day", "Happy")).toBe("day");
  });
});

describe("plantStage", () => {
  it("grows with plays and never shrinks", () => {
    expect(plantStage(0)).toBe(0);
    expect(plantStage(1)).toBe(1);
    expect(plantStage(5)).toBe(1);
    expect(plantStage(6)).toBe(2);
    expect(plantStage(16)).toBe(3);
    expect(plantStage(31)).toBe(4);
    expect(plantStage(500)).toBe(4);
    let prev = 0;
    for (let n = 0; n < 80; n++) {
      const s = plantStage(n);
      expect(s).toBeGreaterThanOrEqual(prev);
      prev = s;
    }
  });
});

describe("lighting", () => {
  it("keeps the room readable (never darker than half) and lights the lamp as it darkens", () => {
    for (const tod of ["dawn", "day", "dusk", "night"] as const) {
      for (const m of MOODS) {
        const dim = roomDim(tod, weatherForMood(m));
        expect(dim).toBeGreaterThanOrEqual(0);
        expect(dim).toBeLessThanOrEqual(0.5);
      }
    }
    expect(lampGlow("day")).toBe(0);
    expect(lampGlow("night")).toBe(1);
    expect(lampGlow("dusk")).toBeGreaterThan(lampGlow("dawn"));
  });
});

describe("greetingFor", () => {
  it("greets by the clock", () => {
    expect(greetingFor(8)).toBe("Good morning");
    expect(greetingFor(14)).toBe("Good afternoon");
    expect(greetingFor(19)).toBe("Good evening");
    expect(greetingFor(23)).toBe("Hello, night owl");
    expect(greetingFor(3)).toBe("Hello, night owl");
  });
});
