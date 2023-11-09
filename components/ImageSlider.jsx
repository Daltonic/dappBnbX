import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper'

const ImageSlider = ({ images }) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={false}
      modules={[Autoplay, Pagination, Navigation]}
      className="w-96 h-52 rounded-t-2xl overflow-hidden"
    >
      {images.map((url, i) => (
        <SwiperSlide key={i}>
          <img className="w-full" src={url} alt={'image slide ' + i} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default ImageSlider
