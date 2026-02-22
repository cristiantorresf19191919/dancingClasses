import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayRemove,
  arrayUnion,
  query,
  orderBy,
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
  phone: string;
  modality: string;
  danceStyle: string;
  salsaSubStyle?: string;
  level: string;
  date: string;
  time: string;
  createdAt: Timestamp;
}

export interface CreateBookingParams {
  name: string;
  email: string;
  phone: string;
  modality: string;
  danceStyle: string;
  salsaSubStyle?: string;
  level: string;
  date: string;
  time: string;
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
  params: CreateBookingParams
): Promise<{ success: boolean; message: string }> {
  try {
    const { name, email, phone, modality, danceStyle, salsaSubStyle, level, date, time } = params;

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
    const bookingData: Record<string, unknown> = {
      name,
      email,
      phone,
      modality,
      danceStyle,
      level,
      date,
      time,
      createdAt: Timestamp.now(),
    };
    if (salsaSubStyle) {
      bookingData.salsaSubStyle = salsaSubStyle;
    }
    await setDoc(bookingRef, bookingData);

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
 * Fetch all bookings, ordered by date desc.
 */
export async function getAllBookings(): Promise<Booking[]> {
  const q = query(collection(db, "bookings"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  const bookings: Booking[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    bookings.push({
      id: docSnap.id,
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      modality: data.modality || "",
      danceStyle: data.danceStyle || "",
      salsaSubStyle: data.salsaSubStyle,
      level: data.level || "",
      date: data.date || "",
      time: data.time || "",
      createdAt: data.createdAt,
    });
  });

  return bookings;
}

/**
 * Cancel a booking: delete the booking doc and restore the time slot.
 */
export async function cancelBooking(
  bookingId: string,
  date: string,
  time: string
): Promise<{ success: boolean; message: string }> {
  try {
    await deleteDoc(doc(db, "bookings", bookingId));

    const calendarRef = doc(db, "calendar", date);
    const calendarSnap = await getDoc(calendarRef);
    if (calendarSnap.exists()) {
      await updateDoc(calendarRef, {
        availableTimes: arrayUnion(time),
      });
    } else {
      await setDoc(calendarRef, { availableTimes: [time] });
    }

    return { success: true, message: "Reserva cancelada correctamente." };
  } catch (error) {
    console.error("Cancel booking error:", error);
    return { success: false, message: "Error al cancelar la reserva." };
  }
}

/**
 * Add availability: set or merge time slots for a date.
 */
export async function addAvailability(
  date: string,
  times: string[]
): Promise<void> {
  const calendarRef = doc(db, "calendar", date);
  const calendarSnap = await getDoc(calendarRef);

  if (calendarSnap.exists()) {
    await updateDoc(calendarRef, {
      availableTimes: arrayUnion(...times),
    });
  } else {
    await setDoc(calendarRef, { availableTimes: times });
  }
}

/**
 * Remove a single time slot from a date.
 */
export async function removeTimeSlot(
  date: string,
  time: string
): Promise<void> {
  const calendarRef = doc(db, "calendar", date);
  await updateDoc(calendarRef, {
    availableTimes: arrayRemove(time),
  });
}

/**
 * Remove an entire date from the calendar.
 */
export async function removeDate(date: string): Promise<void> {
  await deleteDoc(doc(db, "calendar", date));
}

/**
 * Fetch all calendar entries.
 */
export async function getAllCalendarDays(): Promise<CalendarDay[]> {
  const snapshot = await getDocs(collection(db, "calendar"));
  const days: CalendarDay[] = [];

  snapshot.forEach((docSnap) => {
    days.push({
      id: docSnap.id,
      availableTimes: docSnap.data().availableTimes || [],
    });
  });

  return days.sort((a, b) => a.id.localeCompare(b.id));
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
