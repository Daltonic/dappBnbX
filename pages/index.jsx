import Head from 'next/head'
import { generateFakeApartment } from '@/utils/fakeData'
import { Category, Collection } from '@/components'

export default function Home({ apartmentData }) {
  return (
    <div>
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Category />
      <Collection appartments={apartmentData} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const apartmentData = generateFakeApartment(5)
  return {
    props: { apartmentData: JSON.parse(JSON.stringify(apartmentData)) },
  }
}
