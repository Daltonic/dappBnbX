import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { CiEdit } from 'react-icons/ci'
import { MdDeleteOutline } from 'react-icons/md'
import { deleteApartment } from '@/services/blockchain'
import { toast } from 'react-toastify'

const Actions = ({ apartment }) => {
  const navigate = useRouter()
  const { address } = useAccount()

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete Apartment ${apartment?.id}?`)) {
      await toast.promise(
        new Promise(async (resolve, reject) => {
          await deleteApartment(apartment?.id)
            .then(async () => {
              navigate.push('/')
              resolve()
            })
            .catch(() => reject())
        }),
        {
          pending: 'Approve transaction...',
          success: 'Apartment deleted successfully 👌',
          error: 'Encountered error 🤯',
        }
      )
    }
  }

  return (
    <div className="flex justify-start items-center space-x-3 border-b-2 border-b-slate-200 pb-6">
      {address == apartment?.owner && (
        <>
          <Link
            href={'/room/edit/' + apartment?.id}
            className="p-2 rounded-md shadow-lg border-[0.1px]
              border-gray-500 flex justify-start items-center space-x-1
              bg-gray-500 hover:bg-transparent hover:text-gray-500 text-white"
          >
            <CiEdit size={15} />
            <small>Edit</small>
          </Link>
          <button
            className="p-2 rounded-md shadow-lg border-[0.1px]
              border-pink-500 flex justify-start items-center space-x-1
              bg-pink-500 hover:bg-transparent hover:text-pink-500 text-white"
            onClick={handleDelete}
          >
            <MdDeleteOutline size={15} />
            <small>Delete</small>
          </button>
        </>
      )}
    </div>
  )
}

export default Actions
