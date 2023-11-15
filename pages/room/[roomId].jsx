import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { globalActions } from '@/store/globalSlices'
import { generateFakeReviews } from '@/utils/fakeData'
import { useDispatch, useSelector } from 'react-redux'
import { getApartment, getBookedDates, getSecurityFee } from '@/services/blockchain'
import { Title, ImageGrid, Description, Calendar, Actions, Review, AddReview } from '@/components'

export default function Room({ apartmentData, timestampsData, reviewsData, securityFee }) {
  const router = useRouter()
  const { roomId } = router.query
  const dispatch = useDispatch()

  const { setApartment, setTimestamps, setReviewModal, setReviews, setSecurityFee } = globalActions
  const { apartment, timestamps, booked, reviews } = useSelector((states) => states.globalStates)
  dispatch(setSecurityFee(securityFee))

  useEffect(() => {
    dispatch(setApartment(apartmentData))
    dispatch(setTimestamps(timestampsData))
    dispatch(setReviews(reviewsData))
  }, [
    dispatch,
    setApartment,
    apartmentData,
    setTimestamps,
    timestampsData,
    setReviews,
    reviewsData,
  ])

  const handleReviewOpen = () => {
    dispatch(setReviewModal('scale-100'))
  }

  return (
    <>
      <Head>
        <title>Room | {apartment?.name}</title>
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
  const apartmentData = await getApartment(roomId)
  const timestampsData = await getBookedDates(roomId)
  const reviewsData = generateFakeReviews(5)
  const securityFee = await getSecurityFee()

  return {
    props: {
      apartmentData: JSON.parse(JSON.stringify(apartmentData)),
      timestampsData: JSON.parse(JSON.stringify(timestampsData)),
      reviewsData: JSON.parse(JSON.stringify(reviewsData)),
      securityFee: JSON.parse(JSON.stringify(securityFee)),
    },
  }
}
