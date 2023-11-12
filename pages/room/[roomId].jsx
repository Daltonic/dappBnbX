import Head from 'next/head'
import { useRouter } from 'next/router'
import { generateFakeReviews } from '@/utils/fakeData'
import { useGlobalState, setGlobalState } from '@/store'
import { getApartment, getBookedDates } from '@/services/blockchain'
import { Title, ImageGrid, Description, Calendar, Actions, Review, AddReview } from '@/components'

export default function Room({ apartment, timestamps, reviews }) {
  const router = useRouter()
  const { roomId } = router.query
  const [booked] = useGlobalState('booked')

  const handleReviewOpen = () => {
    setGlobalState('reviewModal', 'scale-100')
  }

  return (
    <>
      <Head>
        <title>Room Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="py-8 px-10 sm:px-20 md:px-32 space-y-8">
        <Title name={apartment?.name} rooms={apartment?.rooms} />

        <ImageGrid
          first={apartment?.images[0]}
          second={apartment?.images[1]}
          third={apartment?.images[2]}
          forth={apartment?.images[3]}
          fifth={apartment?.images[4]}
        />

        <Description description={apartment?.description} location={apartment?.location} />
        <Calendar apartment={apartment} timestamps={timestamps} />
        <Actions id={apartment?.id} owner={apartment?.owner} />

        <div className="flex flex-col justify-between flex-wrap space-y-2">
          <h1 className="text-xl font-semibold">Reviews</h1>
          <div>
            {reviews.map((review, i) => (
              <Review key={i} review={review} />
            ))}
            {reviews.length < 1 && 'No reviews yet!'}
          </div>
        </div>

        {booked && (
          <button
            className="underline mt-11 cursor-pointer hover:text-blue-700"
            onClick={handleReviewOpen}
          >
            Drop your review
          </button>
        )}
      </div>
      <AddReview roomId={roomId} />
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { roomId } = context.query
  const apartment = await getApartment(roomId)
  const timestamps = await getBookedDates(roomId)
  const reviews = generateFakeReviews(5)
  return {
    props: {
      apartment: JSON.parse(JSON.stringify(apartment)),
      timestamps: JSON.parse(JSON.stringify(timestamps)),
      reviews: JSON.parse(JSON.stringify(reviews)),
    },
  }
}
