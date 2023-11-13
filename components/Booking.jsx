import Link from 'next/link'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import Identicon from 'react-identicons'
import { formatDate, truncate } from '@/utils/helper'

const Booking = ({ booking }) => {
  const { address } = useAccount()

  //   useEffect(async () => {
  //     const params = {
  //       booking.aid,
  //       bookingId: booking.id,
  //     }
  //     await hasBookedDateReached(params)
  //   }, [])

  const handleCheckIn = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        // await checkInApartment(booking.aid, booking.id)
        //   .then(async () => {
        //     await getBookings(booking.aid)
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
      id: booking.aid,
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

  const functions = {
    bookedDayStatus,
    handleCheckIn,
    handleRefund,
  }

  return <TenantView booking={booking} functions={functions} owner={address} />
}

const TenantView = ({ booking, functions, owner }) => {
  return (
    <div className="w-full flex justify-between items-center my-3 bg-gray-100 p-3">
      <Link
        className="flex justify-start items-center
      space-x-2 font-medium"
        href={'/room/' + booking.aid}
      >
        <Identicon
          string={booking.tenant}
          size={30}
          className="rounded-full shadow-gray-500 shadow-sm"
        />
        <div className="flex flex-col">
          <span>{formatDate(booking.date)}</span>
          <span className="text-gray-500 text-sm">{truncate(booking.tenant, 4, 4, 11)}</span>
        </div>
      </Link>

      {booking.tenant == owner && !booking.checked && (
        <div className="flex space-x-2">
          <button
            className="p-2 bg-green-500 text-white rounded-full text-sm px-4"
            onClick={functions.handleCheckIn}
          >
            Check In
          </button>

          <button
            className="p-2 bg-red-500 text-white rounded-full text-sm px-4"
            onClick={functions.handleRefund}
          >
            Refund
          </button>
        </div>
      )}

      {booking.tenant == owner && booking.checked && (
        <button
          className="p-2 bg-yellow-500 text-white font-medium italic
        rounded-full text-sm px-4"
        >
          Checked In
        </button>
      )}

      {booking.tenant != owner && (
        <button
          className="p-2 bg-pink-500 text-white font-medium italic
        rounded-full text-sm px-4"
        >
          Booked
        </button>
      )}
    </div>
  )
}

export default Booking
