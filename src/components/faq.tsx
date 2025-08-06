import React, { useState } from "react";

const faqs = [
  {
    question: "What is WillovateResto?",
    answer:
      "WillovateResto is a platform that helps restaurant owners create their own digital website, manage menus, and accept customer orders through a QR code system.",
  },
  {
    question: "How do I create my restaurant website?",
    answer:
      "After subscribing to a plan, you can use the 'CreateResto' feature in your dashboard to design and publish your personalized restaurant website.",
  },
  {
    question: "What is the QR code feature used for?",
    answer:
      "Your customers can scan the QR code to view your website, explore the menu, and place orders directly online without downloading any app.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a 5-day free trial with limited features so you can explore the platform before subscribing.",
  },
  {
    question: "Which features are available in the Pro plan?",
    answer:
      "The Pro plan includes a dashboard with real-time analytics, inventory management, customer insights, and advanced customization options.",
  },
  {
    question: "Can I switch or cancel my subscription anytime?",
    answer:
      "Yes, you can upgrade, downgrade, or cancel your subscription anytime directly from your WillovateResto dashboard.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full py-10 px-4 -mt-4 -mb-10 mt-2">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-center text-[#1A1A1A]">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-lg px-4 py-3 transition-all duration-300 ${
                openIndex === index
                  ? "bg-orange-100 border-orange-300 shadow-md"
                  : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left flex justify-between items-center"
              >
                <span className="text-base font-medium text-lg text-[#333]">
                  {faq.question}
                </span>
                <span
                  className={`text-2xl font-bold text-[#FF7A00] transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                >
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 text-gray-700 text-sm ${
                  openIndex === index
                    ? "max-h-60 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-sm">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
