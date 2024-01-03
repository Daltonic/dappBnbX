import { ethers } from 'ethers'
import address from '@/contracts/contractAddress.json'
import abi from '@/artifacts/contracts/DappBnbX.sol/DappBnbX.json'
import { globalActions } from '@/store/globalSlices'
import { store } from '@/store'

const toWei = (num) => ethers.parseEther(num.toString())
const fromWei = (num) => ethers.formatEther(num)

let ethereum, tx
const { setTimestamps, setBookings, setReviews } = globalActions

if (typeof window !== 'undefined') ethereum = window.ethereum

const getEthereumContracts = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(address.dappBnbXContract, abi.abi, signer)
    return contract
  } else {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contract = new ethers.Contract(address.dappBnbXContract, abi.abi, signer)
    return contract
  }
}

const getApartments = async () => {
  const contract = await getEthereumContracts()
  const apartments = await contract.getApartments()
  return structureAppartments(apartments)
}

const getApartment = async (id) => {
  const contract = await getEthereumContracts()
  const apartment = await contract.getApartment(id)
  return structureAppartments([apartment])[0]
}

const getReviews = async (id) => {
  const contract = await getEthereumContracts()
  const reviews = await contract.getReviews(id)
  return structuredReviews(reviews)
}

const getBookings = async (id) => {
  const contract = await getEthereumContracts()
  const bookings = await contract.getBookings(id)
  return structuredBookings(bookings)
}

const getQualifiedReviewers = async (id) => {
  const contract = await getEthereumContracts()
  const reviewers = await contract.getQualifiedReviewers(id)
  return reviewers
}

const getBookedDates = async (id) => {
  const contract = await getEthereumContracts()
  const bookings = await contract.getUnavailableDates(id)
  const timestamps = bookings.map((timestamp) => Number(timestamp))
  return timestamps
}

const getSecurityFee = async () => {
  const contract = await getEthereumContracts()
  const fee = await contract.securityFee()
  return Number(fee)
}

const createApartment = async (apartment) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.createApartment(
      apartment.name,
      apartment.description,
      apartment.location,
      apartment.images,
      apartment.rooms,
      toWei(apartment.price)
    )

    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const updateApartment = async (apartment) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.updateApartment(
      apartment.id,
      apartment.name,
      apartment.description,
      apartment.location,
      apartment.images,
      apartment.rooms,
      toWei(apartment.price)
    )

    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const deleteApartment = async (id) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.deleteApartment(id)

    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const bookApartment = async ({ aid, timestamps, amount }) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.bookApartment(aid, timestamps, {
      value: toWei(amount),
    })

    await tx.wait()
    const bookedDates = await getBookedDates(aid)

    store.dispatch(setTimestamps(bookedDates))
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const checkInApartment = async (aid, bookingId) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.checkInApartment(aid, bookingId)

    await tx.wait()
    const bookings = await getBookings(aid)

    store.dispatch(setBookings(bookings))
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const refundBooking = async (aid, bookingId) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.refundBooking(aid, bookingId)

    await tx.wait()
    const bookings = await getBookings(aid)

    store.dispatch(setBookings(bookings))
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const claimFunds = async (aid, bookingId) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.claimFunds(aid, bookingId)

    await tx.wait()
    const bookings = await getBookings(aid)

    store.dispatch(setBookings(bookings))
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const addReview = async (aid, comment) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.addReview(aid, comment)

    await tx.wait()
    const reviews = await getReviews(aid)

    store.dispatch(setReviews(reviews))
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const structureAppartments = (appartments) =>
  appartments
    .map((apartment) => ({
      id: Number(apartment.id),
      name: apartment.name,
      owner: apartment.owner,
      description: apartment.description,
      location: apartment.location,
      price: fromWei(apartment.price),
      deleted: apartment.deleted,
      images: apartment.images.split(','),
      rooms: Number(apartment.rooms),
      timestamp: Number(apartment.timestamp),
      booked: apartment.booked,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredReviews = (reviews) =>
  reviews
    .map((review) => ({
      id: Number(review.id),
      aid: Number(review.aid),
      text: review.reviewText,
      owner: review.owner,
      timestamp: Number(review.timestamp),
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredBookings = (bookings) =>
  bookings
    .map((booking) => ({
      id: Number(booking.id),
      aid: Number(booking.aid),
      tenant: booking.tenant,
      date: Number(booking.date),
      price: fromWei(booking.price),
      checked: booking.checked,
      cancelled: booking.cancelled,
      abandoned: booking.abandoned,
    }))
    .sort((a, b) => b.date - a.date)
    .reverse()

export {
  getApartments,
  getApartment,
  getReviews,
  getBookings,
  getQualifiedReviewers,
  getBookedDates,
  getSecurityFee,
  updateApartment,
  createApartment,
  deleteApartment,
  bookApartment,
  checkInApartment,
  refundBooking,
  claimFunds,
  addReview,
}
