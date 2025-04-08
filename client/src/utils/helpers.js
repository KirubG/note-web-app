export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ") // Split by space
    .slice(0, 2) // Take the first two words
    .map((word) => word.charAt(0).toUpperCase()) // Get the first character of each word and capitalize it
    .join(""); // Join the initials together
}


export const truncateText = (text) => {
  if (text.length <= 40) return text;
  return text.substring(0, 40) + '...';
};
