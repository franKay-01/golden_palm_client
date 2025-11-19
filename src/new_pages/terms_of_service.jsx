import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import YellowBrushImg from '../assets/images/brush_yellow.png'
import Asset15 from '../assets/images/asset_15.png'
import Asset17 from '../assets/images/asset_17.png'
import Asset12 from '../assets/images/asset_12.png'
import Asset11 from '../assets/images/asset_11.png'

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      
      <div className="relative max-w-7xl mx-auto px-4 pb-12">
        <div className="hidden md:block md:absolute lg:absolute top-[8rem] -left-[12rem] transform rotate-12">
          <img src={Asset15} alt="" className='w-[15rem] h-[14rem]'/>
        </div>
        <div className="hidden md:block md:absolute lg:absolute top-[40rem] -left-20 transform rotate-12">
          <img src={Asset12} alt="" className='w-[7rem] h-[10rem]'/>
        </div>
        <div className="hidden md:block md:absolute lg:absolute top-[-8rem] right-12 transform rotate-12">
          <img src={Asset17} alt="" className='w-[12rem] h-[15rem]'/>
        </div>
        <div className="hidden md:block md:absolute lg:absolute top-[40rem] -right-[2rem] transform rotate-12">
          <img src={Asset11} alt="" className='w-[5rem] h-[5rem]'/>
        </div>
       
        <div className='flex flex-col items-center justify-center mb-8 md:mb-12 mt-12'>
          <h3 className="text-3xl md:text-5xl lg:text-8xl font-caslon text-gp-light-green">Terms of Service</h3>
          <img src={YellowBrushImg} alt="Yellow Brush" />
        </div>
        
        <div className="mx-auto px-4">
          <div className="bg-gp-yellow rounded-2xl overflow-hidden shadow-md p-8 flex flex-col gap-4">
            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Effective Date: [Insert Date]</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
                Throughout this site, the terms “we,” “us,” and “our” refer to <span className='font-canaro-semibold'>Golden Palm Foods</span>. By visiting goldenpalmfoods.com, placing an order, or using any part of our website, you agree to be bound by the following Terms of Service. If you do not agree with these Terms, we kindly ask that you refrain from using our site or services.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 1 – Eligibility</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              To use this site or make a purchase, you must be at least 18 years of age or have the permission and supervision of a parent or legal guardian. By using our site, you confirm that you meet this requirement.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 2 – Product Information</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              We take care to ensure that the products listed on our site are described and displayed as accurately as possible. However, we do not guarantee that all product details, prices, or images are free from errors. We reserve the right to correct any inaccuracies or omissions and to update product information at any time, even after an order has been placed.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 3 – Orders</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              When you place an order on our website, you agree that the information provided is accurate and complete. You also confirm that you are authorized to use the payment method submitted. Golden Palm Foods reserves the right to refuse or cancel any order at our discretion, including those suspected of fraud, misuse, or availability issues.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 4 – Pricing & Payment</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              All prices are listed in U.S. Dollars (USD) and may include applicable taxes, depending on your location. Payment is due at the time of purchase and is securely processed through a third-party payment platform. We do not store your full credit card or payment information on our servers.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 5 – Shipping & Delivery</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              We currently ship orders within the continental United States. Shipping costs and estimated delivery timelines are provided during the checkout process. Once an order has been shipped, responsibility for delivery transfers to the shipping carrier. Golden Palm Foods is not liable for delays, damages, or lost packages that occur during transit.
              </h1>
            </div>


            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 6 – Returns & Refunds</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              Please refer to our FAQ page for the most up-to-date information on our return and refund policy. If your order arrives damaged, incorrect, or otherwise unsatisfactory, contact us at <a href='mailto:hello@goldenpalmfoods.com' className='font-canaro-semibold'>hello@goldenpalmfoods.com</a> within 7 days of delivery. We will do our best to resolve the issue promptly and fairly.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 7 – Intellectual Property</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              All content on this website — including but not limited to text, photographs, graphics, logos, recipes, and product names — is the property of Golden Palm Foods and is protected under copyright and trademark law. You may not copy, reproduce, republish, or distribute any site content without our express written permission.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 8 – User Conduct</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              You agree to use our site in a lawful and respectful manner. This means not posting or transmitting any unlawful, offensive, or harmful content; not interfering with the site’s functionality or security; and not attempting to gain unauthorized access to our systems or customer data. Misuse of the site may result in restricted access and potential legal action.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 9 – Health & Allergen Disclaimer</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              Our products may contain or come into contact with common allergens such as shrimp, herring, peanuts, tree nuts, or seeds. It is your responsibility to review ingredient lists before use or consumption. Golden Palm Foods is not liable for any allergic reactions or adverse effects resulting from product misuse or failure to read ingredient disclosures.
              </h1>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 10 – Limitation of Liability</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              To the maximum extent permitted by law, Golden Palm Foods shall not be liable for any indirect, incidental, punitive, or consequential damages arising from the use of our products or website. Our total liability for any claim will not exceed the amount you paid for the product in question.
              </h1>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 11 – Indemnification</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              You agree to indemnify, defend, and hold harmless Golden Palm Foods, its team members, and affiliates from any claims, losses, damages, or legal expenses arising from your breach of these Terms or your misuse of our website or products.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 12 – Governing Law</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              These Terms of Service and any disputes arising out of your use of our site are governed by and construed in accordance with the laws of the State of Arizona, without regard to conflict of law principles. Any legal action shall be filed in state or federal courts located in Arizona.
              </h1>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 13 – Changes to These Terms</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              We reserve the right to update or modify these Terms at any time. Any changes will be posted on this page, and the effective date will be updated accordingly. Your continued use of the site after changes are posted constitutes your acceptance of the revised Terms.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 14 – Third-Party Services</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              We may use trusted third-party providers — such as MailerLite — to manage aspects of our email marketing, communication tools, or analytics. These providers have their own privacy policies and terms. Golden Palm Foods is not responsible for any issues, interruptions, or data security breaches that arise from these platforms.
              </h1>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Section 15 – Contact Information</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              If you have any questions about these Terms or need support, please contact us at:
              </h1>

              <a href='mailto:hello@goldenpalmfoods.com' className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              hello@goldenpalmfoods.com
              </a>
              <a href='https://goldenpalmfoods.com' className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              https://goldenpalmfoods.com
              </a>
              
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
    </>
  );
};