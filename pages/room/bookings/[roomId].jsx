import { Booking } from '@/components'
import { useRouter } from 'next/router'
import { getApartment, getBookings } from '@/services/blockchain'

const Bookings = ({ apartmentData, bookingsData }) => {
  const router = useRouter()
  const { roomId } = router.query
  const apartment = apartmentData
  const bookings = bookingsData

  return (
    <div className="w-full sm:w-3/5 mx-auto mt-8">
      <h1 className="text-center text-3xl text-black font-bold">Bookings</h1>
      {bookings.length < 1 && <div>No bookings for this apartment yet</div>}

      {bookings.map((booking, i) => (
        <Booking key={i} id={roomId} booking={booking} apartment={apartment} />
      ))}
    </div>
  )
}

export default Bookings

export const getServerSideProps = async (context) => {
  const { roomId } = context.query
  const apartmentData = await getApartment(roomId)
  const bookingsData = await getBookings(roomId)

  return {
    props: {
      apartmentData: JSON.parse(JSON.stringify(apartmentData)),
      bookingsData: JSON.parse(JSON.stringify(bookingsData)),
    },
  }
}
