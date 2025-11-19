import React, { useState } from 'react';
import { Facebook, Instagram, Tiktok, Plus, Minus} from 'lucide-react';
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
      answer: `We currently ship across the United States. Shipping rates are calculated at checkout based on your location. Once your order is placed, please allow 3–5 business days for processing and shipping. You’ll receive a confirmation email with tracking details once your order is on the way.
      
      Please note that processing and delivery times may be longer during holidays or high-demand periods. We appreciate your patience and understanding.
      
      Because our products are food-based, all sales are final. We do not accept returns or offer refunds.
      
      If your order arrives damaged or incorrect, please contact us within 5 days of delivery at hello@goldenpalmfoods.com with your order number and a photo. We’ll review the issue and do our best to make it right.`
    },
    {
      question: "Can I change my shipping address after ordering?",
      answer: "We begin processing orders quickly, so changes may not be possible once an order is placed. If you need to make a change, email us at hello@goldenpalmfoods.com as soon as possible, and we’ll do our best to accommodate your request."
    },
    {
      question: "My tracking says delivered, but I didn't receive it. What should I do?",
      answer: `If your tracking status says “delivered” but you haven’t received your package, please double-check that the shipping address you entered at checkout is correct.
      
      Next, we recommend contacting the shipping carrier (e.g. USPS or UPS) directly—they may have more information about the delivery status. If the issue remains unresolved after speaking with the carrier, please email us at hello@goldenpalmfoods.com within 5 days of the marked delivery date, and we’ll do our best to assist you.
      
      Please note that Golden Palm Foods is not responsible for lost or stolen packages that have been confirmed as delivered by the carrier. We encourage customers to choose secure delivery locations whenever possible.`
    },
    {
      question: "Do you offer wholesale or private label options?",
      answer: `Yes! We offer wholesale, co-branding, and private label options for businesses that align with our mission. Whether you're a retailer, food service provider, or a brand looking to source West African ingredients, we’d love to connect.
      
      To learn more, visit our Wholesale page or email us at hello@goldenpalmfoods.com.`
    },
    {
      question: "How should I store your products?",
      answer: `Each product includes storage instructions on the label, but here are some general guidelines:

      # Chili Paste: Refrigerate after opening and always use a clean spoon to avoid contamination.
      
      # Coconut Oil: Store in a cool, dry place. It may solidify when cold and liquefy when warm—this is completely natural and does not affect quality.
      
      # Red Palm Oil: Keep tightly sealed in a cool, dark place away from direct sunlight. Do not refrigerate, as it may affect the texture.
      
      # Peanut Oil: Store in a cool, dry place away from heat and light. Be sure to close the cap tightly after each use.
      
      # All-Purpose Spice Blend: Keep tightly sealed and store in a cool, dry pantry away from heat and sunlight.
      
      # Bambara Beans: Store in an airtight container in a cool, dry place.
      
      If you have any questions about a specific product, feel free to email us at hello@goldenpalmfoods.com
      `
    },
    {
      question: "Where can I buy your products?",
      answer: `You can shop our full product line directly on our website. We also sell at local pop-up markets in Arizona.
      
      We're currently working on getting our products into retail stores. To stay updated on retail launches, upcoming events, and restocks, follow us on Instagram, Facebook, TikTok, and Threads (@goldenpalmfoods) or sign up for our newsletter.`
    },
    {
      question: "Do you ship internationally?",
      answer: `Not yet—but we’re working on it! We currently only ship within the United States.
      
      To be the first to know when international shipping becomes available, sign up for our newsletter or follow us on social media @goldenpalmfoods.`
    },
    {
      question: "Do your products contain preservatives or allergens?",
      answer: `Our products are made with real, natural ingredients and contain no artificial preservatives, fillers, or additives.
      
      Some products may contain common allergens such as peanuts or shrimp powder. All ingredients are listed on our product labels and website. If you have food allergies or dietary concerns, please review the ingredient list carefully or email us at hello@goldenpalmfoods.com with any questions before ordering.`
    },
    {
      question: "Where do you source your ingredients from?",
      answer: `We source many of our ingredients directly from women traders and smallholder farmers in Togo and across West Africa. Our mission is to highlight the richness of West African food traditions while supporting local economies through direct relationships.
      
      For our chili paste, we also source certain fresh ingredients locally in Arizona to ensure quality and freshness. As we grow, we plan to expand our line of handmade products while continuing to build strong sourcing partnerships.
      
      When you shop with us, you’re helping build a bridge between African producers and kitchens around the world.`
    },
    {
      question: "Who can I contact for press or media inquiries?",
      answer: `For press, media, or collaboration inquiries, please email us at hello@goldenpalmfoods.com with the subject line “Press Inquiry”. We’ll get back to you as soon as possible.`
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