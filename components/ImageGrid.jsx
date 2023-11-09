const ImageGrid = ({ first, second, third, forth, fifth }) => {
  return (
    <div className="mt-8 h-[32rem] flex rounded-2xl overflow-hidden">
      <div className="md:w-1/2 w-full overflow-hidden">
        <img className="object-cover w-full h-full" src={first} />
      </div>
      <div className="w-1/2 md:flex hidden flex-wrap">
        <img src={second} className="object-cover w-1/2 h-64 pl-2 pb-1 pr-1" />
        <img src={third} alt="" className="object-cover w-1/2 h-64 pl-1 pb-1" />
        <img src={forth} className="object-cover w-1/2 h-64 pt-1 pl-2 pr-1" />
        <img src={fifth} className="object-cover sm:w-2/5 md:w-1/2 h-64 pl-1 pt-1" />
      </div>
    </div>
  )
}

export default ImageGrid
