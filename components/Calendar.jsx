import moment from 'moment'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import { FaEthereum } from 'react-icons/fa'
import { bookApartment } from '@/services/blockchain'

const Calendar = ({ apartment, timestamps }) => {
  const [checkInDate, setCheckInDate] = useState(null)
  const [checkOutDate, setCheckOutDate] = useState(null)
  const { securityFee } = useSelector((states) => states.globalStates)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!checkInDate || !checkOutDate) return
    const start = moment(checkInDate)
    const end = moment(checkOutDate)
    const timestampArray = []

    while (start <= end) {
      timestampArray.push(start.valueOf())
      start.add(1, 'days')
    }

    const params = {
      aid: apartment?.id,
      timestamps: timestampArray,
      amount:
        apartment?.price * timestampArray.length +
        (apartment?.price * timestampArray.length * securityFee) / 100,
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await bookApartment(params)
          .then(async () => {
            resetForm()
            resolve()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'Apartment booked successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const resetForm = () => {
    setCheckInDate(null)
    setCheckOutDate(null)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sm:w-[25rem] border-[0.1px] p-6
      border-gray-400 rounded-lg shadow-lg flex flex-col
      space-y-4"
    >
      <div className="flex justify-between">
        <div className="flex justify-center items-center">
          <FaEthereum className="text-lg text-gray-500" />
          <span className="text-lg text-gray-500">
            {apartment?.price} <small>per night</small>
          </span>
        </div>
      </div>

      <DatePicker
        id="checkInDate"
        selected={checkInDate}
        onChange={setCheckInDate}
        placeholderText="YYYY-MM-DD (Check In)"
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
        excludeDates={timestamps}
        required
        className="rounded-lg w-full border border-gray-400 p-2"
      />
      <DatePicker
        id="checkOutDate"
        selected={checkOutDate}
        onChange={setCheckOutDate}
        placeholderText="YYYY-MM-DD (Check out)"
        dateFormat="yyyy-MM-dd"
        minDate={checkInDate}
        excludeDates={timestamps}
        required
        className="rounded-lg w-full border border-gray-400 p-2"
      />
      <button
        className="p-2 border-none bg-gradient-to-l from-pink-600
        to-gray-600 text-white w-full rounded-md focus:outline-none
        focus:ring-0"
      >
        Book
      </button>

      <Link href={`/room/bookings/${apartment?.id}`} className="text-pink-500">
        Check your bookings
      </Link>
    </form>
  )
}

export default Calendar
