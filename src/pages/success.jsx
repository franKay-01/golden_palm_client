import { useState } from 'react';
export default function Success(){
  const [successful, setSuccessful] = useState(false)

  // useEffect(() => {
  //   const { pathname, search, hash } = location;

  //   const params = new URLSearchParams(search);
  //   const success = params.get("success");
  //   const canceled = params.get("canceled");
  //   if (success !== null) {
  //     setSuccessful(true)
  //   }else{
  //     setSuccessful(false)
  //   }
  // },[]);

  return (
    <>
      <div class="max-w-screen-xl px-4 py-8 mx-auto lg:py-24 lg:px-6">
        <div class="max-w-screen-md mx-auto mb-8 text-center lg:mb-12">
          <h2 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900">Designed for clients like yours</h2>
        </div>
        <div class="max-w-screen-md mx-auto mb-8 lg:mb-12">
          <div className='flex justify-center'>
            {/* <img src={SuccessGif} alt="Success"/> */}
          </div>
          <div className='left-center'>
            <p class="mb-5 font-light font-bold text-gray-900 sm:text-xl">Dear valued customer,</p>
          </div>
          <div className='left-center'>
            <p class="mb-5 font-light text-gray-500 sm:text-xl">We are thrilled to inform you that your payment was successfully processed! We greatly appreciate your trust and support in choosing our services. Your payment confirmation brings us immense joy and reaffirms our commitment to delivering an exceptional experience.</p>
          </div>
          <div className='left-center'>
            <p class="mb-5 font-light text-gray-500 sm:text-xl">At Golden Palm Foods, we strive to provide the highest quality products and ensure that your needs are met with utmost care. Your satisfaction is our top priority, and we will continue to go above and beyond to exceed your expectations.</p>
          </div>
          <div className='left-center'>
            <p class="mb-5 font-light text-gray-500 sm:text-xl">Reach out to US (<a className='underline item-card-price' href="mailto:hellogoldenpalmfoods@gmail.com">hellogoldenpalmfoods@gmail.com</a>) for any other issues.</p>
          </div>
          <div className='flex justify-center'>
            <a href='/'  className="login-button h-14 text-white font-normal p-4 mt-4 rounded-lg flex justify-center send-button">
              <p className="font-bold	text-base send-p flex flex-row justify-center items-center space-x-4">Home
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send bu-send ml-2" viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                </svg>
              </p>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
