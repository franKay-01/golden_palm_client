import React from 'react';
import { X } from 'lucide-react';
import BrushImg from "../assets/images/brush_white.png"

export default function AboutModal({ isOpen, onClose, section }) {
  if (!isOpen || !section) return null;

  const getContent = () => {
    switch (section) {
      case 'story':
        return {
          title: 'Our Story',
          content: `
          Golden Palm Foods began as a solution to a problem faced by many West African families living in the U.S.—the struggle to find authentic ingredients that carried the tastes of home. Moving to the U.S. at a young age, a mother and her daughter  found it hard to access the foods that connected them to their heritage. The spices, oils, and flavors that once brought comfort and a sense of belonging were nearly impossible to find in local stores.\n
          As the mother continued to recreate these cherished West African dishes in their kitchen, her daughter saw an opportunity. Why not share these incredible flavors with others? Why not give people a way to experience the tastes and stories of West Africa, even if they've never been there? Together, they turned this family passion into a mission.\n
          Golden Palm Foods was born from this love—a love for food, culture, and the desire to connect people through the universal experience of a meal. From our crunchy roasted peanuts to our bold spice mixes and rich chili paste, every product brings the true, authentic flavors of West Africa straight to your kitchen. It’s about making these flavors accessible, whether you're reconnecting with your roots or trying something new for the first time.\n
          We also believe in making a difference beyond the food. By sourcing directly from smallholder farmers and market women in West Africa, we not only bring you the best, but we also support communities and create opportunities where they are most needed. With every product, we invite you to join us on a journey—a journey of flavor, culture, and connection. `};
      case 'why':
        return {
          title: 'Why Choose Us',
          content: `• Honest Ingredients: We believe in keeping things simple—pure, natural, and full of flavor, just like food should be. Our ingredients are not only wholesome but also sourced sustainably, supporting farmers, market women, and the environment with every bite.\n
• A Taste of Home: Every jar, every packet is crafted to bring the heart of West African cooking to your table, no matter where you are.\n
• Wholesome & Delicious: Our products provide plant-based options that are not only rich in nutrients, but also add a healthy, flavorful twist to your meals.\n
• Cooking Made Special: Whether you're looking for something new or craving a familiar taste, our products help make every meal something to remember.`
        };
      case 'mission':
        return {
          title: 'Our Mission',
          content: `At Golden Palm Foods, our mission is to make West African food accessible and represented in U.S. grocery stores. We are passionate about sharing authentic flavors, working directly with smallholder farmers and market women in West Africa who help bring our products to life. By supporting these farmers and communities, we not only deliver quality ingredients to your kitchen but also help create market access and economic opportunities back home.\n
          We want you to experience the real, unrefined taste of Africa—whether it’s our rich, natural palm oil or our bold spice mixes—without needing to search far and wide. Our products offer a simple, flavorful way to enjoy the vibrant culinary traditions of West Africa.`
        };
      case 'vision':
        return {
          title: 'Our Vision',
          content: `Golden Palm Foods envisions a future where West African flavors are a celebrated staple in kitchens everywhere. Rooted in tradition and crafted with authenticity, our products offer a taste of home for some, a bridge to heritage for others, and a delicious invitation for anyone eager to explore bold, global flavors. We believe great food connects people, and West Africa has a story worth sharing.\n
          We aim to bridge the gap between cultures, educating consumers about the true value of West African food. Our vision is to secure a place for West African cuisine on grocery shelves nationwide, so everyone can enjoy the tastes, stories, and traditions that make these foods so special.`
        };
      default:
        return { title: '', content: '' };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative bg-gp-yellow rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="text-gray-600" size={24} />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh] px-8 py-8">
          <h2 className="text-[3rem] font-caslon text-gp-light-green">{title}</h2>
          <img src={BrushImg} alt="" />
          <div className="text-gray-700 text-[20px] mt-4 leading-relaxed font-canaro-light">
            {content.split('\n').map((line, index) => {
              const boldPattern = /^(• )(.+?:)/;
              const match = line.match(boldPattern);

              if (match) {
                return (
                  <div key={index} className="mb-2">
                    {match[1]}
                    <span className="font-canaro-semibold">{match[2]}</span>
                    {line.substring(match[0].length)}
                  </div>
                );
              }
              return <div key={index} className="mb-[2px]">{line || '\u00A0'}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
