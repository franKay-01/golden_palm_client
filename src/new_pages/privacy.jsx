import React, { useState } from 'react';
import { Facebook, Instagram, Tiktok, Plus, Dot} from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import YellowBrushImg from '../assets/images/brush_yellow.png'
import Asset15 from '../assets/images/asset_15.png'
import Asset17 from '../assets/images/asset_17.png'
import Asset12 from '../assets/images/asset_12.png'
import Asset11 from '../assets/images/asset_11.png'

export default function PrivacyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({
    1: true, // First item expanded by default
  });

  // Toggle function - allows multiple items to be open
  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    {
      question: "What is your shipping and refund policy?",
      answer: `We currently ship across the United States. Shipping rates are calculated at checkout based on your location. Once your order is placed, please allow 3-5 business days for processing and shipping.

You'll receive a confirmation email with tracking details once your order is on the way. Please note that processing and delivery times may be longer during holidays or high-demand periods.
We appreciate your patience and understanding.

Because our products are food-based, all sales are final. We do not accept returns or offer refunds.

If your order arrives damaged or incorrect, please contact us within 5 days of delivery at hello@goldenpalmfoods.com with your order number and a photo.

We'll review the issue and do our best to make it right.`
    },
    {
      question: "Can I change my shipping address after ordering?",
      answer: "Please contact us immediately at hello@goldenpalmfoods.com if you need to change your shipping address. We can only modify addresses before your order has been shipped."
    },
    {
      question: "My tracking says delivered, but I didn't receive it. What should I do?",
      answer: "First, check with neighbors and building management if applicable. Check all possible delivery locations around your property. If you still cannot locate your package, contact us at hello@goldenpalmfoods.com with your order number within 5 days of the delivery date."
    },
    {
      question: "Do you offer wholesale or private label options?",
      answer: "Yes! We offer wholesale pricing for bulk orders and private label options for businesses. Please contact our business team at wholesale@goldenpalmfoods.com for more information and pricing."
    },
    {
      question: "How should I store your products?",
      answer: "Store all our products in a cool, dry place away from direct sunlight. Once opened, refrigerate and consume within the timeframe indicated on the product label. Most of our products have a shelf life of 12-18 months when unopened."
    },
    {
      question: "Where can I buy your products?",
      answer: "You can purchase our products directly from our website at goldenpalmfoods.com. We also partner with select retailers across the United States. Check our store locator on the website to find a retailer near you."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within the United States. We're working on expanding our international shipping options. Please sign up for our newsletter to be notified when international shipping becomes available."
    },
    {
      question: "Do your products contain preservatives or allergens?",
      answer: "We use minimal, natural preservatives in our products. All ingredients and potential allergens are clearly listed on each product label. Please read labels carefully if you have food allergies or sensitivities."
    },
    {
      question: "Where do you source your ingredients from?",
      answer: "We source our ingredients directly from farmers and cooperatives in West Africa, primarily Ghana. We maintain close relationships with our suppliers to ensure quality, sustainability, and fair trade practices."
    },
    {
      question: "Who can I contact for press or media inquiries?",
      answer: "For press and media inquiries, please contact our PR team at press@goldenpalmfoods.com. We'll respond to your inquiry within 2 business days."
    }
  ];

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
          <h3 className="text-3xl md:text-5xl lg:text-8xl font-caslon text-gp-light-green">Privacy Policy</h3>
          <img src={YellowBrushImg} alt="Yellow Brush" />
        </div>
        
        <div className="mx-auto px-4">
          <div className="bg-gp-yellow rounded-2xl overflow-hidden shadow-md p-8 flex flex-col gap-4">
            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>Effective Date: [Insert Date]</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              This Privacy Policy describes how Golden Palm Foods (“we,” “us,” or “our”) collects, uses, and shares your personal information when you visit or make a purchase from 
              <a href='https://goldenpalmfoods.com' className='underline ml-2'>https://goldenpalmfoods.com</a> (the “Site”) or otherwise interact with our services. By using the Site, you agree to the practices described in this policy.
              </h1>
            </div>
            
            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>1. Information We Collect</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
                We may collect the following types of information:
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
               <span className='font-canaro-semibold'># Personal Information </span>– such as your name, email address, phone number, shipping/billing address, and payment details when you place an order, join our newsletter, or contact us.
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
               <span className='font-canaro-semibold'># Non-Personal Information </span>– like IP address, browser type, device type, and how you use our website (via cookies or analytics tools).
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>2. How We Use Your Information</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              We use the information we collect to:
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
                # Fulfill and deliver your orders
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
               # Communicate with you (e.g., order updates, customer service)
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
                # Send marketing communications if you’ve opted in
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
                # Improve our website and understand how customers interact with it
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>3. Email Marketing</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              If you subscribe to our newsletter, we may email you with product news, promotions, or updates. You can unsubscribe at any time by clicking the “unsubscribe” link in our emails or contacting us directly.
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              We use trusted third-party platforms (such as MailerLite) to manage email communications. These platforms have their own privacy practices and security measures.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>4. Cookies & Analytics</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              We may use cookies or tracking technologies to improve user experience and understand visitor behavior. You can control cookie settings through your browser preferences.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>5. Sharing Your Information</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              We do not sell or rent your personal information. We may share your data with third-party service providers (e.g., payment processors, fulfillment services, email platforms) only as needed to operate the Site and fulfill your requests — always under secure, privacy-compliant conditions.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>6. Data Security</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              We take appropriate security measures to protect your data, including encryption and access controls. However, no method of internet transmission is 100% secure, so we cannot guarantee absolute security.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>7. Children’s Privacy</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from minors. If we become aware of such data, we will delete it immediately.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>8. Your Rights</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              You have the right to:
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              # Access or correct your personal information
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              # Request deletion of your data
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              # Opt out of marketing communications at any time
              </h1>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              To make any of these requests, email us at hello@goldenpalmfoods.com.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>9. Changes to This Policy</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              We may update this Privacy Policy periodically. The updated version will be posted on this page with a revised effective date. Please review it regularly.
              </h1>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='font-canaro-semibold text-gp-light-green text-[1rem] md:text-[1.5rem]'>10. Contact Us</p>
              <h1 className='font-canaro-book text-gp-light-green text-[1rem] md:text-[1.2rem]'>
              If you have any questions or concerns about this Privacy Policy or how we handle your information, reach out to us at: <a href="mailto:hello@goldenpalmfoods.com">hello@goldenpalmfoods.com</a>
              </h1>
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
    </>
  );
};