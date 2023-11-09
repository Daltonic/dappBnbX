import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
  appartments: [],
  appartment: null,
  reviews: [],
  authModal: "scale-0",
  reviewModal: "scale-0",
  securityFee: null,
  bookings: [],
  booking: null,
  booked: false,
  status: null,
  timestamps: [],
});

const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars);
    let end = text.substring(text.length - endChars, text.length);
    while (start.length + end.length < maxLength) {
      start = start + ".";
    }
    return start + end;
  }
  return text;
};

export { setGlobalState, useGlobalState, getGlobalState, truncate };