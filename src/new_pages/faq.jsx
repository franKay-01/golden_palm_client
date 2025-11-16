import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Plus, Minus} from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import YellowBrushImg from '../assets/images/brush_yellow.png'
import Asset13 from '../assets/images/asset_13.png'
import Asset15 from '../assets/images/asset_15.png'
import Asset17 from '../assets/images/asset_17.png'
import Asset2 from '../assets/images/asset_2.png'
import Asset12 from '../assets/images/asset_12.png'
import Asset11 from '../assets/images/asset_11.png'
import Asset8 from '../assets/images/asset_8_alt.png'
import Asset6 from '../assets/images/asset_6.png'
import Asset18 from '../assets/images/asset_18.png'
import Asset15Alt from '../assets/images/asset_15_alt.png'

export default function FaqPage() {
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
          <h3 className="text-3xl md:text-5xl lg:text-8xl font-caslon text-gp-light-green">FAQs</h3>
          <img src={YellowBrushImg} alt="Yellow Brush" />
        </div>
        
        <div className="mx-auto px-4">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gp-yellow rounded-2xl overflow-hidden shadow-md"
              >
                <button
                  onClick={() => toggleExpand(index + 1)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-orange-400 transition-colors"
                >
                  <span className="flex items-center gap-4">
                    {expandedItems[index + 1] ? (
                      <Minus className="text-gp-light-green" size={24} />
                    ) : (
                      <Plus className="text-gp-light-green" size={24} />
                    )}
                    <span className="font-canaro-book text-gp-light-green text-[1rem] md:text-[1.5rem]">
                      {index + 1}. {faq.question}
                    </span>
                  </span>
                </button>
                
                {expandedItems[index + 1] && (
                  <div className="px-6 pb-6 pl-14">
                    <p className="text-gp-light-green font-canaro-book whitespace-pre-line leading-relaxed text-[1rem] md:text-[1.2rem]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer/>
    </>
  );
};