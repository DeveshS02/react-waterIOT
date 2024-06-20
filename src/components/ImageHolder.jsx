import React from 'react'

const ImageHolder = (src) => {
    console.log(src);
  return (
    <div className='image-holder'>
        <img src={src} alt="Node Image" />
    </div>
  )
}

export default ImageHolder