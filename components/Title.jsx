const Title = ({ name, rooms }) => {
  return (
    <div>
      <h1 className="text-3xl font-semibold capitalize">{name}</h1>
      <div className="flex justify-between">
        <div className="flex items-center mt-2 space-x-2
        text-lg text-slate-500">
          {rooms} {rooms == 1 ? 'room' : 'rooms'}
        </div>
      </div>
    </div>
  )
}

export default Title
