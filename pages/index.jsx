import Head from 'next/head'
import { generateFakeApartment } from '@/utils/fakeData'
import { Category, Collection } from '@/components'

export default function Home({ apartmentsData }) {
  return (
    <div>
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Category />
      <Collection appartments={apartmentsData} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const apartmentsData = generateFakeApartment(5)
  return {
    props: { apartmentsData: JSON.parse(JSON.stringify(apartmentsData)) },
  }
}
