"use client";
import { useState } from 'react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { BookingDTO } from '../dto/booking';
import { getBookings, createBooking } from '../api/booking';

export default function Home() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [meetingName, setMeetingName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const { data, isLoading, isError } = useQuery<BookingDTO[]>({
    queryFn: async () => await getBookings(),
    queryKey: ["bookings"],
  });

  const mutation = useMutation({
    mutationFn: async (newBooking: Partial<BookingDTO>) => {
      return await createBooking(newBooking); // Llama a tu API para crear la reserva
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] }); 
      setOpen(false);
      setMeetingName("");
      setStartTime("");
      setEndTime("");
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newBooking = {
      meetingName,
      startTime,
      endTime,
    };
    mutation.mutate(newBooking);
  };

  function formatDateTime(dateString: Date) {
    return format(new Date(dateString), "MMMM d, yyyy 'at' HH:mm");
  }

  function isConflictError(error: Error): boolean {
    try {
      const parsed = JSON.parse(error.message);
      return parsed.code === 400 && Array.isArray(parsed.data);
    } catch {
      return false;
    }
  }
  

  return (
    <div className="min-h-full bg-white">
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-700 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 justify-center">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-white-900">
                      New Booking
                    </DialogTitle>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form  onSubmit={handleSubmit} action="#" method="POST" className="space-y-6">
                          <div>
                            <label htmlFor="meetingName" className="block text-sm/6 font-medium text-white-900">
                              Meeting name
                            </label>
                            <div className="mt-2">
                              <input
                                id="meetingName"
                                name="meetingName"
                                type="text"
                                required
                                autoComplete="meetingName"
                                value={meetingName}
                                onChange={(e) => setMeetingName(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-white-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <label htmlFor="startTime" className="block text-sm/6 font-medium text-white-900">
                                Start Date
                              </label>
                            </div>
                            <div className="mt-2">
                              <input
                                id="startTime"
                                name="startTime"
                                type="date"
                                required
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-white-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <label htmlFor="endTime" className="block text-sm/6 font-medium text-white-900">
                                End Date
                              </label>
                            </div>
                            <div className="mt-2">
                              <input
                                id="endTime"
                                name="endTime"
                                type="date"
                                required
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-white-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              />
                            </div>
                          </div>

                          <div>
                          <button
                              type="submit"
                              disabled={mutation.isPending}
                              className="flex w-full justify-center rounded-md bg-white text-black px-3 py-1.5 text-sm/6 font-semibold shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                               {mutation.isPending ? "Submitting..." : "Schedule"}
                            </button>
                          </div>

                          {mutation.error && (
                              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                                <p className="font-semibold">Error:</p>
                                {isConflictError(mutation.error) ? (
                                  <div>
                                    <p>{JSON.parse(mutation.error.message).message}</p>
                                    <div className="mt-2">
                                      <p className="font-medium">Conflicting Schedules:</p>
                                      <ul className="list-disc list-inside">
                                        {JSON.parse(mutation.error.message).data.map((conflict: any, index: number) => (
                                          <li key={index}>
                                            {`Meeting: ${conflict.meetingName}, Start: ${conflict.startTime}, End: ${conflict.endTime}`}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                ) : (
                                  <p>An unexpected error occurred.</p>
                                )}
                              </div>
                            )}


                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

       <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white bg-black"
            >
              Schedule Booking
            </button>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

            {isLoading? 
              <div role="status" className="max-w-sm animate-pulse">
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                  <span className="sr-only">Loading...</span>
              </div>
              :
              data && data.length?
              <ul role="list" className="divide-y divide-gray-100">
              {data.map((booking: BookingDTO, key) => (
                <li key={key} className="flex justify-between gap-x-6 py-5">
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm/6 font-semibold text-gray-900">{booking.meetingName}</p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm/6 text-gray-900">Start: {formatDateTime(new Date(booking.startTime))}</p>
                    <p className="mt-1 text-xs/5 text-gray-500">End: {formatDateTime(new Date(booking.endTime))}</p>
                  </div>
                </li>
              ))}
            </ul>:
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-indigo-600">{"Bookings not found :("}</h2>
            </div>
            }
          </div>
        </main>
    </div>
  );
}
