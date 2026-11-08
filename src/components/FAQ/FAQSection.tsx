import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { ScrollReveal } from '../Common/ScrollReveal';
import { restaurantData } from '../../data/restaurantData';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Where is ILA KOCHI located and how do I reach it?',
    answer: 'We are situated right by Metro Pillar No. 350, Behind Unimoni, in Pathadipalam, Edappally / Kalamassery, Kochi 682024. If arriving by Kochi Metro, exit at Pathadipalam Metro Station; we are located directly along the pillar corridor near Kerala History Museum.',
  },
  {
    question: 'What time is the traditional Banana Leaf Meal served?',
    answer: 'Our fresh Banana Leaf Meals are served every afternoon from 12:00 PM to 4:00 PM. In the evening, from 6:30 PM to 11:00 PM, the kitchen switches to live cast-iron tawa fries, chemmeen roasts, and coastal seafood dinners.',
  },
  {
    question: 'Can I check catch availability and pre-order fresh fish?',
    answer: 'Yes! Because our seafood arrives fresh daily from local fishing boats, catches vary by tide. You can tap our WhatsApp button to check today’s live catch and pre-reserve specialities like Karimeen Pollichathu or Kalanji Tawa Fry.',
  },
  {
    question: 'Is parking available at the restaurant?',
    answer: 'Yes, convenient parking space is available near Metro Pillar 350 and behind the Unimoni building for both cars and two-wheelers.',
  },
  {
    question: 'Do you offer pure vegetarian meals on banana leaves?',
    answer: 'Yes, we prepare authentic traditional Kerala vegetarian meals served on fresh plantain leaves, featuring daily vegetable thoran, avial, sambar, rasam, moru curry, chammanthi, and crispy pappadam.',
  },
  {
    question: 'How do table reservations work?',
    answer: 'Submit your preferred date, time slot, and party size through our online inquiry form. It instantly opens a formatted WhatsApp chat with our manager to confirm table availability within minutes.',
  },
  {
    question: 'Is takeaway packed in traditional banana leaves?',
    answer: 'Yes, our meals, kizhi biriyanis, and fish roasts are carefully wrapped in charred plantain leaves to retain moisture and authentic aroma on your journey home.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#0B291E] border-t border-[#176B45]/30 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up" distance={40}>
          <div className="text-center max-w-xl mx-auto space-y-3 mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D2A] border border-[#176B45]/50 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-sans-ui">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Everything You Need to Know</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-medium tracking-tight text-[#F8F6EE] leading-tight text-balance">
              Frequently asked questions.
            </h2>
            <p className="text-sm sm:text-base text-[#DCE8D5]/80 font-light leading-relaxed text-pretty">
              Timings, location, parking, and banana leaf dining details.
            </p>
          </div>
        </ScrollReveal>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <ScrollReveal key={idx} direction="up" distance={20} delay={idx * 0.05}>
                <div className="rounded-2xl sm:rounded-3xl bg-[#123D2A]/60 border border-[#176B45]/40 overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-serif-display font-medium text-[#F8F6EE]">
                      {faq.question}
                    </span>
                    <div
                      className={`p-2 rounded-full bg-[#0B291E]/60 text-[#C5A46D] border border-[#176B45]/40 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#DCE8D5]/80 font-light leading-relaxed border-t border-[#176B45]/20 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <a
            href={restaurantData.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-sans-ui uppercase tracking-wider text-[#C5A46D] hover:text-[#d8b982] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Have more questions? Ask our manager directly on WhatsApp &rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
};
