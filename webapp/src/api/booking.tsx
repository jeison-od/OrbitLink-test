"use client";
import { BookingDTO } from '../dto/booking';

async function getData() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json"
      },
    };
  
    const response = fetch(
      "http://localhost:3001/",
      options
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));
  
    return response;
  }
  
export async function getBookings() {
  const data = await getData();
  return data;
}

export async function createBooking(newBooking: Partial<BookingDTO>) {
  const response = await fetch('http://localhost:3001/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBooking),
  });

  if (!response.ok) {
    const errorData = await response.json();  // Capturamos el cuerpo de la respuesta
    const errorMessage = errorData.message || 'Failed to create booking';
    throw new Error(JSON.stringify({ code: response.status, message: errorMessage, data: errorData.data }));
  }

  return response.json();
}
