import { ethers } from 'ethers'
import { store } from '@/store'
import { globalActions } from '@/store/globalSlices'
import address from '@/contracts/contractAddress.json'
import dappBnbAbi from '@/artifacts/contracts/DappBnb.sol/DappBnb.json'

const toWei = (num) => ethers.parseEther(num.toString())
const fromWei = (num) => ethers.formatEther(num)

let ethereum, tx

if (typeof window !== 'undefined') ethereum = window.ethereum
const { setBookings, setTimestamps, setReviews } = globalActions

const getEthereumContracts = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contracts = new ethers.Contract(address.dappBnbContract, dappBnbAbi.abi, signer)

    return contracts
  } else {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contracts = new ethers.Contract(address.dappBnbContract, dappBnbAbi.abi, signer)

    return contracts
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

const getBookings = async (id) => {
  const contract = await getEthereumContracts()
  const bookings = await contract.getBookings(id)
  return structuredBookings(bookings)
}

const getQualifiedReviewers = async (id) => {
  const contract = await getEthereumContracts()
  const bookings = await contract.getQualifiedReviewers(id)
  return bookings
}

const getReviews = async (id) => {
  const contract = await getEthereumContracts()
  const reviewers = await contract.getReviews(id)
  return structuredReviews(reviewers)
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
    tx = await contract.createAppartment(
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
    tx = await contract.updateAppartment(
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

const deleteApartment = async (aid) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.deleteAppartment(aid)
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

const checkInApartment = async (aid, timestamps) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.checkInApartment(aid, timestamps)

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
  appartments.map((appartment) => ({
    id: Number(appartment.id),
    name: appartment.name,
    owner: appartment.owner,
    description: appartment.description,
    location: appartment.location,
    price: fromWei(appartment.price),
    deleted: appartment.deleted,
    images: appartment.images.split(','),
    rooms: Number(appartment.rooms),
    timestamp: Number(appartment.timestamp),
    booked: appartment.booked,
  }))

const structuredBookings = (bookings) =>
  bookings.map((booking) => ({
    id: Number(booking.id),
    aid: Number(booking.aid),
    tenant: booking.tenant,
    date: Number(booking.date),
    price: fromWei(booking.price),
    checked: booking.checked,
    cancelled: booking.cancelled,
  }))

const structuredReviews = (reviews) =>
  reviews.map((review) => ({
    id: Number(review.id),
    aid: Number(review.aid),
    text: review.reviewText,
    owner: review.owner,
    timestamp: Number(review.timestamp),
  }))

export {
  getApartments,
  getApartment,
  getBookings,
  getBookedDates,
  createApartment,
  updateApartment,
  deleteApartment,
  bookApartment,
  checkInApartment,
  refundBooking,
  addReview,
  getReviews,
  getQualifiedReviewers,
  getSecurityFee,
}
