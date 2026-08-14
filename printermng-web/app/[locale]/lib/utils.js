export const MONTHS = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

export function formatDate(dateString) {
  const [year, month] = dateString.split("-");

  return `${MONTHS[Number(month) - 1]} ${year}`;
}

export function currentDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}`;
}

export function removeDay(dateString) {
  if(dateString === undefined || dateString === null) return "";
  const parts = dateString.split("-");
  
  // If it already only has Year and Month, return it as is
  if (parts.length <= 2) {
    return dateString;
  }
  
  // Otherwise, drop the day part and keep only Year-Month
  return `${parts[0]}-${parts[1]}`;
}

export const formatMoney = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0
});