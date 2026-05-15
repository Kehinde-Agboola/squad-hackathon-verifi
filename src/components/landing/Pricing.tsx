'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₦25,000',
    period: '/mo',
    desc: 'For platforms just getting started',
    popular: false,
    features: [
      '50 verifications / month',
      'CAC + bank match',
      'Email support',
      'API access',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '₦80,000',
    period: '/mo',
    desc: 'For scaling marketplaces',
    popular: true,
    features: [
      '200 verifications / month',
      'Document AI analysis',
      'Squad bond escrow',
      'Webhooks & dashboards',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large platforms & banks',
    popular: false,
    features: [
      'Unlimited verifications',
      'Dedicated success manager',
      '99.99% SLA',
      'Custom integrations',
      'White-label option',
    ],
  },
];

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-ts-green font-medium mb-4">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-ts-display font-semibold tracking-tight mb-4">
            Plans that scale with trust
          </h2>
          <p className="text-ts-text-sec text-[15px]">
            Start free for the first 10 verifications. No credit card required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="relative rounded-2xl p-7 flex flex-col"
              style={{
                background: '#0D1117',
                border: plan.popular ? '1px solid rgba(0,217,126,0.5)' : '1px solid #21262D',
                boxShadow: plan.popular
                  ? '0 0 60px -10px rgba(0,217,126,0.25), 0 30px 80px -30px rgba(0,0,0,0.7)'
                  : '0 20px 60px -30px rgba(0,0,0,0.5)',
                transform: plan.popular ? 'scale(1.02)' : undefined,
              }}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap"
                  style={{
                    background: '#00D97E',
                    color: '#080C10',
                    boxShadow: '0 0 20px rgba(0,217,126,0.4)',
                  }}
                >
                  Most popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-[20px] font-ts-display font-semibold mb-1.5">{plan.name}</h3>
                <p className="text-[13px] text-ts-text-sec mb-5">{plan.desc}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-ts-display font-semibold tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-[13px] text-ts-text-sec">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-ts-text-pri">
                    <Check size={15} className="text-ts-green flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="block text-center text-[14px] font-medium px-4 py-2.5 rounded-md transition-all duration-150 hover:-translate-y-px"
                style={
                  plan.popular
                    ? {
                        background: '#00D97E',
                        color: '#080C10',
                        boxShadow: '0 8px 24px -8px rgba(0,217,126,0.5)',
                      }
                    : {
                        background: 'transparent',
                        color: '#E6EDF3',
                        border: '1px solid #30363D',
                      }
                }
              >
                {plan.id === 'enterprise' ? 'Talk to sales' : 'Start free'}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
