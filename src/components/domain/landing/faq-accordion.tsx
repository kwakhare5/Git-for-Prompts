'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const faqs = [
  {
    question: 'How does Git for Prompts store my version history?',
    answer:
      'Git for Prompts uses SQLite database engine locally with Postgres cloud sync. Each save operation creates an immutable version snapshot with strict version numbers (v1, v2, v3) and parent lineage pointers.',
  },
  {
    question: 'Can I fetch prompts at runtime in Node.js, Python, or Go?',
    answer:
      'Yes! Our REST API and TypeScript / Python SDKs allow you to fetch active prompts via HTTP GET requests using SHA-256 authenticated API keys. You can also lock your application to specific version numbers.',
  },
  {
    question: 'How do assertion test suites prevent regressions?',
    answer:
      'You define natural language or regex assertion rules (e.g. "must include 30-day refund guarantee"). Whenever you commit a new prompt version, our evaluation engine runs tests across models to grade pass rates.',
  },
  {
    question: 'Is Git for Prompts open-source and local-first?',
    answer:
      'Yes! Your data stays on your system. You can inspect local SQLite databases, run CLI operations offline, and selectively push public prompts to the community library.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 md:py-20 space-y-8 font-sans">
      <div className="text-center space-y-3">
        <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 rounded-md">
          Frequently Asked Questions
        </Badge>
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight font-sans">
          Got Questions? We&apos;ve Got Answers.
        </h2>
        <p className="text-sm md:text-base text-muted-foreground font-sans">
          Everything you need to know about prompt versioning, CLI workflows, and production REST deployment.
        </p>
      </div>

      <Accordion className="rounded-2xl border border-white/10 bg-card/70 backdrop-blur-md p-6 shadow-xl font-sans">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx}>
            <AccordionTrigger isOpen={openIndex === idx} onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent isOpen={openIndex === idx}>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
