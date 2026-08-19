import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import FacebookIcon from '../assets/icons/icons_facebook_yellow.webp'
import InstagramIcon from '../assets/icons/icons_instagram_yellow.webp'
import TiktokIcon from '../assets/icons/icons_tiktok_yellow.webp'
import ShareComponent from './shareComponent';
import { sanitizeArticle } from '../utils/sanitize';

export default function BlogModal({ isOpen, onClose, blog }) {
  // Lock background scroll while the reader is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  if (!isOpen || !blog) return null;

  const publishedAt = blog.createdAt || blog.created_at || blog.date;
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 sm:py-8">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={onClose}
      />

      {/* Article */}
      <article className="relative bg-white rounded-none sm:rounded-2xl shadow-2xl w-full max-w-3xl max-h-screen sm:max-h-[90vh] overflow-y-auto">
        {/* Close button - floats over the hero */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="fixed sm:absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
        >
          <X size={22} />
        </button>

        {/* Featured image */}
        {blog.img_url && (
          <div className="w-full h-56 sm:h-72 md:h-80 overflow-hidden">
            <img
              src={`https://api.goldenpalmfoods.com${blog.img_url}`}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Body - constrained width for readable line length */}
        <div className="px-5 sm:px-10 md:px-14 py-8 sm:py-10">
          <div className="max-w-2xl mx-auto">
            {formattedDate && (
              <p className="text-xs sm:text-sm uppercase tracking-wider text-gray-400 font-canaro-book mb-3">
                {formattedDate}
              </p>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-caslon text-gp-light-green leading-[1.1] mb-6">
              {blog.title}
            </h1>

            {/* Rich text content (sanitized on render, defense in depth). Plain-text still renders fine. */}
            <div
              className="rich-text text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: sanitizeArticle(blog.content) }}
            />

            {/* Footer: share + follow */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <ShareComponent
                title="Share this story"
                buttonClassName="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gp-light-green text-white font-canaro-book hover:bg-green-800 transition-colors"
              >
                Share this story
              </ShareComponent>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 font-canaro-book">Follow us</span>
                <a href="https://www.facebook.com/goldenpalmfoods" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <img src={FacebookIcon} className="w-8 h-8" alt="Facebook" />
                </a>
                <a href="https://www.instagram.com/goldenpalmfoods" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <img src={InstagramIcon} className="w-8 h-8" alt="Instagram" />
                </a>
                <a href="https://www.tiktok.com/@goldenpalmfoods" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <img src={TiktokIcon} className="w-8 h-8" alt="TikTok" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
