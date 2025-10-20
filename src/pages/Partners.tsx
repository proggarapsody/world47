import React from 'react'
import { Container } from 'react-bootstrap'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { motion } from 'framer-motion'

const Partners: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="partners">
        <Container className="d-flex align-items-center flex-nowrap overflow-hidden">
          <Swiper
            className="mySwiper"
            loop={true}
            grabCursor={true}
            breakpoints={{
              0: {
                slidesPerView: 2,
              },
              520: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              992: {
                slidesPerView: 5,
              },
              1198: {
                slidesPerView: 5,
              },
            }}
          >
            <SwiperSlide>
              <img src={require('../images/partners/stellar.png')} alt="img" />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={require('../images/partners/blockport.png')}
                alt="img"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img src={require('../images/partners/fantom.png')} alt="img" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={require('../images/partners/onfido.png')} alt="img" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={require('../images/partners/tr.png')} alt="img" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={require('../images/partners/qa.png')} alt="img" />
            </SwiperSlide>
          </Swiper>
        </Container>
      </div>
    </motion.div>
  )
}

export default Partners
