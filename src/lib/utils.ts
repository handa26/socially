import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPostDate(date: Date | string | number): string {
  const postDate = new Date(date);
  const now = new Date(); // Current time: 2025-06-12T14:25:00Z (adjusted to UTC)

  const daysDifference = differenceInDays(now, postDate);

  if (daysDifference === 0) {
    // Less than 1 day old, use relative time
    return formatDistanceToNow(postDate, { addSuffix: true });
  } else if (daysDifference === 1) {
    // Exactly 1 day old, show "Yesterday"
    return 'Yesterday';
  } else {
    // 2 or more days old, show date in "dd MMMM" format (e.g., "10 June")
    return format(postDate, 'dd MMMM');
  }
}
