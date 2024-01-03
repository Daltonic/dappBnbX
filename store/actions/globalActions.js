export const globalActions = {
  setApartments: (state, action) => {
    state.apartments = action.payload
  },
  setApartment: (state, action) => {
    state.apartment = action.payload
  },
  setReviews: (state, action) => {
    state.reviews = action.payload
  },
  setReviewModal: (state, action) => {
    state.reviewModal = action.payload
  },
  setSecurityFee: (state, action) => {
    state.securityFee = action.payload
  },
  setBookings: (state, action) => {
    state.bookings = action.payload
  },
  setBooking: (state, action) => {
    state.booking = action.payload
  },
  setTimestamps: (state, action) => {
    state.timestamps = action.payload
  },
}
