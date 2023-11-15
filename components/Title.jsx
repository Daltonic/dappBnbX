const Title = ({ apartment }) => {
  return (
    <div>
      <h1 className="text-3xl font-semibold capitalize">{apartment?.name}</h1>
      <div className="flex justify-between">
        <div
          className="flex items-center mt-2 space-x-2
        text-lg text-slate-500"
        >
          {apartment?.rooms} {apartment?.rooms == 1 ? 'room' : 'rooms'}
        </div>
      </div>
    </div>
  )
}

export default Title
