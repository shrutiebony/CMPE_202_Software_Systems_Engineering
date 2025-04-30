import { format, addMinutes, parse } from 'date-fns';

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM d, yyyy');
}

export function formatTime(time: string | null | undefined): string {
  if (!time) return '--:--';
  
  try {
    // Validate time format (HH:mm)
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return '--:--';
    }
    
    const timeObj = parse(time, 'HH:mm', new Date());
    return format(timeObj, 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return '--:--';
  }
}

export function generateTimeSlots(
  startTime: string, 
  endTime: string, 
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  
  // Create date objects for start and end times
  // Use a fixed date for comparison purposes
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const startDate = new Date(baseDate);
  startDate.setHours(startHour, startMinute);
  
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const endDate = new Date(baseDate);
  endDate.setHours(endHour, endMinute);
  
  // Generate time slots
  let currentTime = startDate;
  
  while (currentTime < endDate) {
    slots.push(format(currentTime, 'HH:mm'));
    currentTime = addMinutes(currentTime, intervalMinutes);
  }
  
  return slots;
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDayOfWeek(date: string): string {
  return format(new Date(date), 'EEEE').toLowerCase();
}