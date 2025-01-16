/* eslint-disable no-unused-vars */
import React from 'react'
import { ProductionCompany, Slider, VideoByCategory } from '../components'

function HomePage() {
  return (
    <section className='my-14 md:my-0'>
      <Slider />
      <ProductionCompany />
      <VideoByCategory/>
    </section>
  )
}

export default HomePage