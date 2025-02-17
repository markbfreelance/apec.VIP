import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';

interface Quote {
  id: number;
  name: string;
  description: string;
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote | null;
}

export default function QuoteModal({ isOpen, onClose, quote }: QuoteModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-6">
            {/* Apply transition directly to the content */}
            <div
              className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
              style={{
                transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                transform: isOpen ? 'scale(1)' : 'scale(0.95)',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
                <div className="p-8 space-y-6">
                  <h2 className="text-3xl font-bold text-red-600">
                    {quote?.name || 'Placeholder Title'}
                  </h2>
                  <p className="text-gray-700">
                    {quote?.description ||
                      'This is placeholder content for the description. It could be a long, detailed text describing the quote or providing additional information.'}
                  </p>
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4">Additional Placeholder Content</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                      <li>Suspendisse vehicula, sapien nec ultrices fringilla.</li>
                      <li>Phasellus scelerisque, nunc a tristique auctor, arcu erat tempor nunc.</li>
                      <li>Fusce efficitur, felis eu blandit aliquam, purus odio interdum nisi.</li>
                    </ul>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
