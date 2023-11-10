import Head from 'next/head'
import { getApartments } from '@/services/blockchain'
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
  const apartmentsData = await getApartments()

  return {
    props: {
      apartmentsData: JSON.parse(JSON.stringify(apartmentsData)),
    },
  }
}
