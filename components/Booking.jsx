import { formatDate } from '@/utils/helper'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

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

  if (booking.tenant == address) {
    return <TenantView booking={booking} functions={functions} />
  } else {
    return <DefaultView booking={booking} />
  }
}

const TenantView = ({ booking, functions }) => {
  return (
    <div className="w-full flex justify-between items-center my-3 bg-gray-100 p-3">
      <Link className=" font-medium underline" href={'/room/' + booking.aid}>
        {formatDate(booking.date)}
      </Link>
      {functions.bookedDayStatus(booking) ? (
        <button
          className="p-2 bg-green-500 text-white rounded-full text-sm px-4"
          onClick={functions.handleCheckIn}
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
          onClick={functions.handleRefund}
        >
          Refund
        </button>
      )}
    </div>
  )
}

const DefaultView = ({ booking }) => {
  return (
    <div className="w-full flex justify-between items-center my-3 bg-gray-100 p-3">
      <Link className=" font-medium underline" href={'/room/' + booking.aid}>
        {formatDate(booking.date)}
      </Link>

      <button
        className="p-2 bg-pink-500 text-white font-medium
      italic rounded-full text-sm px-4"
      >
        Booked
      </button>
    </div>
  )
}

export default Booking
