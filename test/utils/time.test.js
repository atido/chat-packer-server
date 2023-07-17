const {
  toHoursAndMinutes,
  extractHoursAndMinutes,
  extractYearMonthDay,
} = require("../../utils/time");

describe("Time functions", () => {
  describe("toHoursAndMinutes", () => {
    it("should convert total minutes to hours and minutes string", () => {
      const totalMinutes = 135;
      const expected = "2h15";

      const result = toHoursAndMinutes(totalMinutes);

      expect(result).toBe(expected);
    });
  });

  describe("extractHoursAndMinutes", () => {
    it("should extract hours and minutes from a date string", () => {
      const dateString = "2023-07-14T08:30:00";
      const expected = "08:30";

      const result = extractHoursAndMinutes(dateString);

      expect(result).toBe(expected);
    });
  });

  describe("extractYearMonthDay", () => {
    it("should extract year, month, and day from a date string", () => {
      const dateString = "2023-07-14T08:30:00";
      const expected = "2023-07-14";

      const result = extractYearMonthDay(dateString);

      expect(result).toBe(expected);
    });
  });
});
