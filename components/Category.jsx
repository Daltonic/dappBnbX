import React from 'react'
import { TbBeach } from 'react-icons/tb'
import { GiCampingTent, GiIsland } from 'react-icons/gi'
import { BsSnow2 } from 'react-icons/bs'
import { RiHotelLine } from 'react-icons/ri'

const Category = () => {
  return (
    <div className="flex justify-center space-x-5 sm:space-x-14 p-4 px-4 border-b-2
     border-b-slate-200 text-gray-600">
      <p className="flex flex-col items-center hover:text-black border-b-2
       border-transparent hover:border-black hover:cursor-pointer pb-2">
        <TbBeach className="text-3xl" />
        Beach
      </p>
      <p className="flex flex-col items-center hover:text-black border-b-2
       border-transparent hover:border-black hover:cursor-pointer pb-2">
        <GiIsland className="text-3xl" />
        Island
      </p>
      <p className="flex flex-col items-center hover:text-black border-b-2
       border-transparent hover:border-black hover:cursor-pointer pb-2">
        <BsSnow2 className="text-3xl" />
        Arctic
      </p>
      <p className="flex flex-col items-center hover:text-black border-b-2
       border-transparent hover:border-black hover:cursor-pointer pb-2">
        <GiCampingTent className="text-3xl" />
        Camping
      </p>
      <p className="flex flex-col items-center hover:text-black border-b-2
       border-transparent hover:border-black hover:cursor-pointer pb-2">
        <RiHotelLine className="text-3xl" />
        Hotel
      </p>
    </div>
  )
}

export default Category
