import { formatDate } from '@/utils/helper'
import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

const Booking = ({ booking, id }) => {
  const { address } = useAccount()

  //   useEffect(async () => {
  //     const params = {
  //       id,
  //       bookingId: booking.id,
  //     }
  //     await hasBookedDateReached(params)
  //   }, [])

  const handleCheckIn = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        // await checkInApartment(id, booking.id)
        //   .then(async () => {
        //     await getBookings(id)
        //     resolve()
        //   })
        //   .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'Checked In successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleRefund = async () => {
    const params = {
      id,
      bookingId: booking.id,
      date: new Date(booking.date).getTime(),
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        // await refund(params)
        //   .then(async () => {
        //     await getUnavailableDates(id)
        //     await getBookings(id)
        //     resolve()
        //   })
        //   .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'refund successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const bookedDayStatus = (booking) => {
    const bookedDate = new Date(booking.date).getTime()
    const current = new Date().getTime()
    const bookedDayStatus = bookedDate < current && !booking.checked
    return bookedDayStatus
  }

  //   booking.tenant != address.toLowerCase() || booking.cancelled == true ? null :
  return (
    <div className="w-full flex justify-between items-center my-3 bg-gray-100 p-3">
      <Link className=" font-medium underline" href={'/room/' + id}>
        {formatDate(booking.date)}
      </Link>
      {bookedDayStatus(booking) ? (
        <button
          className="p-2 bg-green-500 text-white rounded-full text-sm px-4"
          onClick={handleCheckIn}
        >
          Check In
        </button>
      ) : booking.checked ? (
        <button className="p-2 bg-yellow-500 text-white font-medium italic rounded-full text-sm px-4">
          Checked In
        </button>
      ) : (
        <button
          className="p-2 bg-[#ff385c] text-white rounded-full text-sm px-4"
          onClick={handleRefund}
        >
          Refund
        </button>
      )}
    </div>
  )
}

export default Booking
