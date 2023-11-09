import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Booking } from '@/components'
import { generateFakeApartment, generateFakeBookings } from '@/utils/fakeData'

const Bookings = ({ appartment, bookings }) => {
  //   const [loaded, setLoaded] = useState(false)
  const { address } = useAccount()
  const router = useRouter()
  const { roomId } = router.query

  //   useEffect(async () => {
  //     await getBookings(roomId).then(() => setLoaded(true))
  //     await loadAppartment(roomId)
  //   }, [])

  const isDayAfter = (booking) => {
    const bookingDate = new Date(booking.date).getTime()
    const today = new Date().getTime()
    const oneDay = 24 * 60 * 60 * 1000
    return today > bookingDate + oneDay && !booking.checked
  }

  const handleClaimFunds = async (booking) => {
    const params = {
      id: roomId,
      bookingId: booking.id,
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        // await claimFunds(params)
        //   .then(async () => {
        //     await getUnavailableDates(roomId)
        //     await getBookings(roomId)
        //     resolve()
        //   })
        //   .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'funds claimed successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div className="w-full sm:w-3/5 mx-auto mt-8">
      {appartment?.owner != address?.toLowerCase() && (
        <h1 className="text-center text-3xl text-black font-bold">Your bookings</h1>
      )}

      {bookings.length < 1 && <div>No bookings for this appartment yet</div>}
      {bookings.map((booking, i) => (
        <Booking key={i} id={roomId} booking={booking} />
      ))}

      {appartment?.owner == address?.toLowerCase() && (
        <div className="w-full sm:w-3/5 mx-auto mt-8">
          <h1 className="text-3xl text-center font-bold">View booking requests</h1>
          {bookings.length < 1 && 'No bookings yet'}

          {bookings.map((booking, i) => (
            <div key={i} className="w-full my-3 border-b border-b-gray-100 p-3 bg-gray-100">
              <div>{booking.date}</div>
              {isDayAfter(booking) && (
                <button
                  className="p-2 bg-green-500 text-white rounded-full text-sm"
                  onClick={() => handleClaimFunds(booking)}
                >
                  Claim
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Bookings

export const getServerSideProps = async () => {
  const appartment = generateFakeApartment(1)[0]
  const bookings = generateFakeBookings(5)
  return {
    props: {
      appartment: JSON.parse(JSON.stringify(appartment)),
      bookings: JSON.parse(JSON.stringify(bookings)),
    },
  }
}
