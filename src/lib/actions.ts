import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface CalendarDay {
  id: string; // date string like "2025-02-25"
  availableTimes: string[];
}

export interface Booking {
  id?: string;
  name: string;
  email: string;
  date: string;
  time: string;
  createdAt: Timestamp;
}

/**
 * Fetch all available calendar days from Firestore.
 * Each document in "calendar" has: { availableTimes: ["18:00", "19:00", ...] }
 * Document ID = date string (e.g., "2025-02-25")
 */
export async function getAvailableDates(): Promise<CalendarDay[]> {
  const snapshot = await getDocs(collection(db, "calendar"));
  const days: CalendarDay[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.availableTimes && data.availableTimes.length > 0) {
      days.push({
        id: docSnap.id,
        availableTimes: data.availableTimes,
      });
    }
  });

  return days;
}

/**
 * Fetch time slots for a specific date.
 */
export async function getTimeSlotsForDate(
  dateId: string
): Promise<string[]> {
  const docRef = doc(db, "calendar", dateId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return [];

  const data = docSnap.data();
  return data.availableTimes || [];
}

/**
 * Create a booking and remove that time slot from the calendar.
 */
export async function createBooking(
  name: string,
  email: string,
  date: string,
  time: string
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Check that the time slot is still available
    const calendarRef = doc(db, "calendar", date);
    const calendarSnap = await getDoc(calendarRef);

    if (!calendarSnap.exists()) {
      return { success: false, message: "Esta fecha ya no esta disponible." };
    }

    const available: string[] = calendarSnap.data().availableTimes || [];
    if (!available.includes(time)) {
      return {
        success: false,
        message: "Este horario ya fue reservado. Intenta con otro.",
      };
    }

    // 2. Save the booking
    const bookingRef = doc(collection(db, "bookings"));
    await setDoc(bookingRef, {
      name,
      email,
      date,
      time,
      createdAt: Timestamp.now(),
    });

    // 3. Remove the time slot from the calendar
    await updateDoc(calendarRef, {
      availableTimes: arrayRemove(time),
    });

    return {
      success: true,
      message: "Reserva confirmada! Nos vemos en la pista.",
    };
  } catch (error) {
    console.error("Booking error:", error);
    return {
      success: false,
      message: "Hubo un error. Por favor intenta de nuevo.",
    };
  }
}

/**
 * Seed the calendar with sample data (utility for development).
 */
export async function seedCalendar(): Promise<void> {
  const today = new Date();
  const times = ["17:00", "18:00", "19:00", "20:00", "21:00"];

  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Skip Sundays
    if (date.getDay() === 0) continue;

    const dateStr = date.toISOString().split("T")[0];
    const docRef = doc(db, "calendar", dateStr);
    await setDoc(docRef, { availableTimes: [...times] });
  }
}
