import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  const checkmarkVariants = {
    hidden: { 
      scale: 0,
      rotate: -180
    },
    visible: { 
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.3
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.8
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 1
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(58, 140, 82, 0.4)",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
      }}
    >
        {/* Geometric pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, #435817 1px, transparent 0),
              radial-gradient(circle at 18px 18px, #435817 1px, transparent 0)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-md"
        >
          {/* Success Card */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
          >
            {/* Close button */}
            <button
              onClick={() => navigate('/shop?tp=all')}
              className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header section with pattern */}
            <div 
              className="relative py-12 px-6 bg-gradient-to-br from-green-50 to-green-100"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 3px 3px, rgba(67, 88, 23, 0.1) 1px, transparent 0),
                  radial-gradient(circle at 15px 15px, rgba(67, 88, 23, 0.1) 1px, transparent 0)
                `,
                backgroundSize: '36px 36px',
                backgroundPosition: '0 0, 18px 18px'
              }}
            >
              {/* Animated Checkmark Circle */}
              <div className="flex justify-center">
                <motion.div
                  variants={checkmarkVariants}
                  className="relative"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.5
                      }}
                    >
                      <Check 
                        className="w-12 h-12 text-white stroke-[3]" 
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* Pulsing ring animation */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-green-400"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ 
                      scale: [1, 1.3, 1.5],
                      opacity: [0.8, 0.4, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Content section */}
            <div className="px-8 py-8">
              {/* Title */}
              <motion.h1
                variants={textVariants}
                className="text-3xl font-bold text-gray-800 mb-4 text-center"
              >
                Payment Successful 🎉
              </motion.h1>

              {/* Message */}
              <motion.p
                variants={textVariants}
                className="text-gray-600 text-center mb-8 leading-relaxed"
              >
                Your payment has been successfully processed. Now you can go to the homepage & discover new products.
              </motion.p>

              {/* Continue Shopping Button */}
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate('/shop?tp=all')}
                className="w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg relative overflow-hidden"
                style={{
                  background: 'linear-gradient(to right, #3A8C52, #4CAF50)',
                }}
              >
                <span className="relative z-10">Continue shopping</span>
                
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "linear"
                  }}
                />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
  );
}

