const MONTHS = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

export default function formatDate(dateString) {
  const date = new Date(dateString);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}