import Head from 'next/head'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { generateFakeApartment, generateFakeReviews } from '@/utils/fakeData'
import { Title, ImageGrid, Description, Calendar, Actions, Review, AddReview } from '@/components'

export default function Room({
  apartmentData,
  timestampsData,
  reviewsData,
  securityFee,
  qualifiedReviewers,
}) {
  const router = useRouter()
  const { roomId } = router.query
  const { address } = useAccount()
  const apartment = apartmentData
  const timestamps = timestampsData
  const reviews = reviewsData

  const handleReviewOpen = () => {}

  return (
    <>
      <Head>
        <title>Room | {apartment?.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="py-8 px-10 sm:px-20 md:px-32 space-y-8">
        <Title apartment={apartment} />

        <ImageGrid
          first={apartment?.images[0]}
          second={apartment?.images[1]}
          third={apartment?.images[2]}
          forth={apartment?.images[3]}
          fifth={apartment?.images[4]}
        />

        <Description apartment={apartment} />
        <Calendar apartment={apartment} timestamps={timestamps} />
        <Actions apartment={apartment} />

        <div className="flex flex-col justify-between flex-wrap space-y-2">
          <div className="flex justify-start items-center space-x-2">
            <h1 className="text-xl font-semibold">Reviews</h1>
            {qualifiedReviewers?.includes(address) && (
              <button
                className="cursor-pointer text-pink-500 hover:text-pink-700"
                onClick={handleReviewOpen}
              >
                Drop your review
              </button>
            )}
          </div>
          <div>
            {reviews.map((review, i) => (
              <Review key={i} review={review} />
            ))}
            {reviews.length < 1 && 'No reviews yet!'}
          </div>
        </div>
      </div>
      <AddReview roomId={roomId} />
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { roomId } = context.query
  const apartmentData = generateFakeApartment(roomId)[0]
  const timestampsData = []
  const qualifiedReviewers = []
  const reviewsData = generateFakeReviews(4)
  const securityFee = 5

  return {
    props: {
      apartmentData: JSON.parse(JSON.stringify(apartmentData)),
      timestampsData: JSON.parse(JSON.stringify(timestampsData)),
      reviewsData: JSON.parse(JSON.stringify(reviewsData)),
      qualifiedReviewers: JSON.parse(JSON.stringify(qualifiedReviewers)),
      securityFee: JSON.parse(JSON.stringify(securityFee)),
    },
  }
}
