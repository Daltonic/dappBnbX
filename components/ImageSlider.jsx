import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Image from 'next/image'
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
          <SlideImage src={url} alt={'image slide ' + i} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

const SlideImage = ({ src, alt }) => {
  return (
    <div className="w-full h-full relative">
      <Image src={src} alt={alt} fill objectFit="cover" sizes="100vw" />
    </div>
  )
}

export default ImageSlider
