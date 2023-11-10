import { FaAirbnb } from 'react-icons/fa'
import Link from 'next/link'
import { ConnectBtn } from '.'

const Header = () => {
  return (
    <header
      className="flex justify-between items-center p-4 px-8
    sm:px-10 md:px-14 border-b-2 border-b-slate-200 w-full"
    >
      <Link href={'/'}>
        <p className="text-[#ff385c] flex items-center text-xl">
          <FaAirbnb className=" font-semibold" />
          DappBnb
        </p>
      </Link>

      <ButtonGroup />
      <ConnectBtn />
    </header>
  )
}

const ButtonGroup = () => {
  return (
    <div
      className="md:flex hidden items-center justify-center border-gray-300
      border overflow-hidden rounded-full cursor-pointer"
    >
      <div className="inline-flex" role="group">
        <button
          className="
            rounded-l-full
            px-5
            py-3
            text-[#ff385c]
            font-medium
            text-sm
            leading-tight
            hover:bg-black hover:bg-opacity-5
            focus:outline-none focus:ring-0
            transition
            duration-150
            ease-in-out
          "
        >
          Anywhere
        </button>
        <Link href={'/room/add'}>
          <button
            type="button"
            className="
              px-5
              py-3 
              border-x border-gray-300
              text-[#ff385c]
              font-medium
              text-sm
              leading-tight
              hover:bg-black hover:bg-opacity-5
              focus:outline-none focus:ring-0
              transition
              duration-150
              ease-in-out
            "
          >
            Add Rooms
          </button>
        </Link>

        <button
          className="
            rounded-r-full
            px-5
            py-3
            text-[#ff385c]
            font-medium
            text-sm
            leading-tight
            hover:bg-black hover:bg-opacity-5
            focus:outline-none focus:ring-0
            transition
            duration-150
            ease-in-out
          "
        >
          <p className="flex items-center">Any week</p>
        </button>
      </div>
    </div>
  )
}

export default Header
