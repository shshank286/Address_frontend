import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is Samachaar.ai?",
      answer: "Samachaar.ai is an AI-powered news platform that delivers concise and unbiased news summaries. We provide global news insights along with interactive surveys to help users engage with the content and share their opinions."
    },
    {
      question: "How does Samachaar.ai summarize news articles?",
      answer: "We use advanced AI algorithms to analyze and condense news articles into key points, ensuring you get the most important information quickly without losing context."
    },
    {
      question: "What categories of news does Samachaar.ai cover?",
      answer: (
        <ul>
          <li>Politics</li>
          <li>Business</li>
          <li>Technology</li>
          <li>Science</li>
          <li>Sports</li>
          <li>Environment</li>
          <li>Entertainment</li>
          <li>World news</li>
        </ul>
      )
    },
    {
      question: "Can I participate in surveys?",
      answer: "Yes! We encourage users to engage with our dynamic surveys created based on news articles. These surveys are designed to gather public opinions on various topics and provide insightful analytics."
    },
    {
      question: "Is the news on Samachaar.ai unbiased?",
      answer: "We strive to maintain neutrality and provide fact-based news summaries by relying on reputable sources and advanced AI algorithms."
    },
    {
      question: "How frequently is the news updated?",
      answer: "Our news feed is updated in real-time, ensuring you always have access to the latest news and insights."
    },
    {
      question: "Is Samachaar.ai free to use?",
      answer: "Currently, Samachaar.ai is free to use. However, we may introduce premium features in the future for advanced analytics and personalization."
    },
    {
      question: "How can I share feedback or report an issue?",
      answer: "We value your feedback! Please contact us via our support page or email us at support@samachaar.ai."
    },
    {
      question: "Is my data secure on Samachaar.ai?",
      answer: "Yes, we take data security and privacy seriously. Your data is protected and handled in accordance with our Privacy Policy."
    }
  ];

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className=" mx-auto p-6 mt-[-3.6rem] bg-[#e6e6e5]">
      <h2 className="text-3xl font-bold text-center mb-8 font-sans">FAQ - Samachaar.ai</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-300 pb-4"
          >
            <div
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              <h3 className="text-xl font-semibold font-assistant">{faq.question}</h3>
              <span className={`transform transition-transform ${activeIndex === index ? "rotate-180" : ""}`}>
                ▼
              </span>
            </div>
            {activeIndex === index && (
              <div className="mt-2 text-gray-700 font-open-sans">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
