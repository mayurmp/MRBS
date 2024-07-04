/*The function `getSaturdayOfPreviousWeek` takes an input date, calculates the previous Saturday date,and returns it in the format "dd/mm/yyyy".*/

export const getSaturdayOfPreviousWeek = (inputDate) => {
  const dateParts = inputDate.split("/");
  const date = new Date(
    parseInt(dateParts[2], 10),
    parseInt(dateParts[1], 10) - 1,
    parseInt(dateParts[0], 10)
  );
  const dayOfWeek = date.getDay();
  const difference = dayOfWeek > 6 ? dayOfWeek - 6 : 1 + dayOfWeek;
  const previousSaturday = new Date(date);
  previousSaturday.setDate(date.getDate() - difference);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return previousSaturday.toLocaleDateString("en-GB", options);
};

/* The function `isDateInPast` that Checks if a given date string is in the past relative to the current date, ignoring time.Returns true if the comparison date is in the past, false otherwise. */
const currentDate = new Date();
export const isDateInPast = (date) => {
  const [day, month, year] = date.split("/");
  const comparisonDate = new Date(`${year}-${month}-${day}`);
  const currentDateWithoutTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  return comparisonDate < currentDateWithoutTime;
};

/*The `getColorIndex` function takes a `username` as input, calculates a hash value based on the character codes of the username characters, and then returns the remainder of dividing this hash value by the length of the `backgroundColors` array This effectively maps each username to an index in the`backgroundColors` array allowing you to assign a color to each user based on their username. */
export const backgroundColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];
export const getColorIndex = (username) => {
  const hash = username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % backgroundColors.length;
};

/*The function `isInCurrentWeek` determines if a given date falls within the current week and is returning a boolean value indicating whether the date provided in the `dateString` parameter falls within the current week or not.
 */
export const isInCurrentWeek = (dateString) => {
  const dateParts = dateString.split("/");
  const date = new Date(
    parseInt(dateParts[2], 10),
    parseInt(dateParts[1], 10) - 1,
    parseInt(dateParts[0], 10)
  );
  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay();
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDayOfWeek
  );
  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + (6 - currentDayOfWeek)
  );
  return date >= startDate && date <= endDate;
};
