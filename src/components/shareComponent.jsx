import React, { useState } from "react";
import { X } from "lucide-react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon
} from "react-share";
import { ShowToast } from "./showToast";

const ShareComponent = ({ title = "Share this page", color = 'gp-light-green' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    ShowToast("success", "Link copied to clipboard!");
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`bg-${color} text-white px-20 py-4 rounded text-xl font-canaro-book hover:bg-green-800 transition-colors`}
      >
        SHARE
      </button>

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <h3 className="text-2xl font-caslon text-gp-light-green mb-6 text-center pr-8">
              {title}
            </h3>

            {/* Social Buttons */}
            <div className="flex justify-center gap-3 mb-6">
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={48} round />
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl}>
                <TwitterIcon size={48} round />
              </TwitterShareButton>

              <WhatsappShareButton url={shareUrl}>
                <WhatsappIcon size={48} round />
              </WhatsappShareButton>

              <LinkedinShareButton url={shareUrl}>
                <LinkedinIcon size={48} round />
              </LinkedinShareButton>

              <EmailShareButton url={shareUrl}>
                <EmailIcon size={48} round />
              </EmailShareButton>
            </div>

            {/* Copy Link Button */}
            <button
              onClick={copyLink}
              className="w-full py-3 bg-gray-900 text-white rounded-lg mb-3 hover:bg-gray-700 transition-colors font-canaro-book"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareComponent;