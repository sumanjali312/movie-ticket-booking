import React, { useState, useEffect } from 'react'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'   // ✅ fixed
import { dummyBookingData } from '../../assets/assets'
import { dateFormat } from '../../lib/dateFormat'

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const [bookings, setBookings] = useState([])
  const [loading, setIsLoading] = useState(true)

  const getAllBookings = async () => {
    setBookings(dummyBookingData)
    setIsLoading(false)
  }

  useEffect(() => {
    getAllBookings()
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium pl-5">Movie Name</th>
              <th className="p-2 font-medium pl-5">Show Time</th>
              <th className="p-2 font-medium pl-5">Seats</th>
              <th className="p-2 font-medium pl-5">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
  {bookings.map((booking, index) => (
    <tr
      key={index}
      className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
    >
      <td className="p-2 pl-5">{booking.user.name}</td>
      <td className="p-2">{booking.show.movie.title}</td>
      <td className="p-2">{dateFormat(booking.show.showDateTime)}</td>
      <td className="p-2">{booking.bookedSeats.join(", ")}</td>
      <td className="p-2">
        {currency} {booking.amount}
      </td>
    </tr>
  ))}
</tbody>

         
        </table>
      </div>
    </>
  )
}

export default ListBookings
