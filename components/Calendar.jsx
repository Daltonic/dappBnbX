import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useGlobalState } from '@/store'
import DatePicker from 'react-datepicker'
import { FaEthereum } from 'react-icons/fa'

const Calendar = ({ price, id }) => {
  const [checkInDate, setCheckInDate] = useState(null)
  const [checkOutDate, setCheckOutDate] = useState(null)
  const [timestamps] = useGlobalState('timestamps')

  // useEffect(async () => await getUnavailableDates(id))

  const handleCheckInDateChange = (date) => {
    setCheckInDate(date)
  }

  const handleCheckOutDateChange = (date) => {
    setCheckOutDate(date)
  }

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
      id,
      datesArray: timestampArray,
      amount: price * timestampArray.length,
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        // await appartmentBooking(params)
        //   .then(async () => {
        //     resetForm()
        //     resolve()
        //   })
        //   .catch(() => reject())
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
            {price} <small>per night</small>
          </span>
        </div>
      </div>

      <DatePicker
        id="checkInDate"
        selected={checkInDate}
        onChange={handleCheckInDateChange}
        placeholderText={'Check In'}
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
        excludeDates={timestamps}
        required
        className="rounded-lg w-full"
      />
      <DatePicker
        id="checkOutDate"
        selected={checkOutDate}
        onChange={handleCheckOutDateChange}
        placeholderText={'Check out'}
        dateFormat="yyyy-MM-dd"
        minDate={checkInDate}
        excludeDates={timestamps}
        required
        className="rounded-lg w-full"
      />
      <button
        className="p-2 border-none bg-gradient-to-l from-pink-600
        to-gray-600 text-white w-full rounded-md focus:outline-none
        focus:ring-0"
      >
        Book
      </button>

      <Link href={`/bookings/${id}`} className="text-pink-500">
        Check your bookings
      </Link>
    </form>
  )
}

export default Calendar
