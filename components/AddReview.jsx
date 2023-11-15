import { useState } from 'react'
import { toast } from 'react-toastify'
import { FaTimes } from 'react-icons/fa'
import { addReview } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { useDispatch, useSelector } from 'react-redux'

const AddReview = ({ roomId }) => {
  const [reviewText, setReviewText] = useState('')
  const dispatch = useDispatch()

  const { setReviewModal } = globalActions
  const { reviewModal } = useSelector((states) => states.globalStates)

  const resetForm = () => {
    setReviewText('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!reviewText) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await addReview(roomId, reviewText)
          .then(async (tx) => {
            dispatch(setReviewModal('scale-0'))
            resetForm()
            resolve(tx)
          })
          .catch(() => reject())
      }),
      {
        pending: 'Approve transaction...',
        success: 'Review submitted successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
      bg-black bg-opacity-50 transform z-[3000] transition-transform duration-300 ${reviewModal}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Add a review today</p>
            <button
              type="button"
              className="border-0 bg-transparent focus:outline-none"
              onClick={() => dispatch(setReviewModal('scale-0'))}
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-col justify-center items-center rounded-xl mt-5">
            <div
              className="flex justify-center items-center rounded-full overflow-hidden
              h-10 w-40 shadow-md shadow-slate-300 p-4"
            >
              <p className="text-lg font-bold text-slate-700"> DappBnB</p>
            </div>
          </div>

          <div
            className="flex flex-row justify-between items-center
          border border-gray-300 p-2 rounded-xl mt-5"
          >
            <textarea
              className="block w-full text-sm resize-none
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 h-14"
              type="text"
              name="comment"
              placeholder="Drop your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="flex flex-row justify-center items-center w-full text-white text-md
            bg-[#ff385c] py-2 px-5 rounded-full drop-shadow-xl border
            focus:outline-none focus:ring mt-5"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddReview
