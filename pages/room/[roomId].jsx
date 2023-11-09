import Head from 'next/head'
import { useGlobalState } from '@/store'
import { generateFakeApartment, generateFakeReviews } from '@/utils/fakeData'
import { Banner, ImageGrid, Description, Calendar, Actions, Review } from '@/components'
import { useRouter } from 'next/router'

export default function Room({ appartment, reviews }) {
    // console.log(reviews);
  const router = useRouter()
  const { roomId } = router.query
  const [booked] = useGlobalState('booked')
  return (
    <div>
      <Head>
        <title>Room Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="py-8 px-10 sm:px-20 md:px-32 space-y-8">
        <Banner name={appartment?.name} rooms={appartment?.rooms} />

        <ImageGrid
          first={appartment?.images[0]}
          second={appartment?.images[1]}
          third={appartment?.images[2]}
          forth={appartment?.images[3]}
          fifth={appartment?.images[4]}
        />

        <Description description={appartment?.description} />
        <Calendar price={appartment?.price} id={roomId} />
        <Actions id={appartment?.id} owner={appartment?.owner} />

        <div className="flex flex-col justify-between flex-wrap space-y-2">
          <h1 className="text-xl font-semibold">Reviews</h1>
          <div>
            {reviews.map((review, index) => (
              <Review key={index} review={review} />
            ))}
            {reviews.length < 1 && 'No reviews yet!'}
          </div>
        </div>

        {booked && (
          <p
            className="underline mt-11 cursor-pointer hover:text-blue-700"
            onClick={handleReviewOpen}
          >
            Drop your review
          </p>
        )}
      </div>
      {/* <AddReview /> */}
    </div>
  )
}

export const getServerSideProps = async () => {
  const appartment = generateFakeApartment(1)[0]
  const reviews = generateFakeReviews(5)
  return {
    props: {
      appartment: JSON.parse(JSON.stringify(appartment)),
      reviews: JSON.parse(JSON.stringify(reviews)),
    },
  }
}
