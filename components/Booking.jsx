import Link from 'next/link'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import Identicon from 'react-identicons'
import { formatDate, truncate } from '@/utils/helper'
import { checkInApartment, refundBooking, claimFunds } from '@/services/blockchain'

const Booking = ({ booking, apartment }) => {
  const { address } = useAccount()

  const handleCheckIn = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await checkInApartment(booking.aid, booking.id)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Checked In successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleRefund = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await refundBooking(booking.aid, booking.id)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'Refunded successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleFundReclaim = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await claimFunds(booking.aid, booking.id)
          .then((tx) => {
            console.log(tx)
            resolve(tx)
          })
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'Fund reclaimed successfully 👌',
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
    handleFundReclaim,
  }

  return (
    <TenantView
      booking={booking}
      functions={functions}
      currentUser={address}
      owner={apartment.owner}
    />
  )
}

const TenantView = ({ booking, functions, currentUser, owner }) => {
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

      {booking.tenant == currentUser && !booking.checked && !booking.cancelled && (
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

      {booking.tenant == currentUser && booking.checked && !booking.cancelled && (
        <button
          className="p-2 bg-yellow-500 text-white font-medium italic
        rounded-full text-sm px-4"
        >
          Checked In
        </button>
      )}

      {booking.tenant != currentUser && !booking.cancelled && (
        <button
          className="p-2 bg-blue-500 text-white font-medium italic
        rounded-full text-sm px-4"
        >
          Booked
        </button>
      )}

      {currentUser == owner &&
        !booking.cancelled &&
        !booking.checked &&
        booking.date < Date.now() && (
          <button
            className="p-2 bg-green-500 text-white font-medium italic
            rounded-full text-sm px-4"
            onClick={functions.handleFundReclaim}
          >
            Claim Fund
          </button>
        )}

      {booking.cancelled && (
        <button
          className="p-2 bg-orange-500 text-white font-medium italic
        rounded-full text-sm px-4"
        >
          Refunded
        </button>
      )}
    </div>
  )
}

export default Booking
