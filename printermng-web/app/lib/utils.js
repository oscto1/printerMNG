export const MONTHS = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

export default function formatDate(dateString) {
  const [year, month] = dateString.split("-");

  return `${MONTHS[Number(month) - 1]} ${year}`;
}