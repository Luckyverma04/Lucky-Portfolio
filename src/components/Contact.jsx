import React, { useState } from "react";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serviceId = import.meta.env.VITE_APP_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      alert(
        "Contact form is not configured yet. Please email me directly at lv001490@gmail.com"
      );
      return;
    }

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.message.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name.trim(),
          to_name: "Lucky Verma",
          from_email: form.email.trim(),
          to_email: "lv001490@gmail.com",
          message: form.message.trim(),
        },
        publicKey
      );

      alert(
        "Thank you. I will get back to you as soon as possible."
      );

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);

      alert(
        "Ahh, something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xl:mt-12 flex xl:flex-row flex-col gap-10 overflow-hidden">
      {/* Contact Form */}
      <div className="flex-[0.75] bg-black-100 p-8 rounded-2xl">
        <p className={styles.sectionSubText}>
          Get in touch
        </p>

        <h3 className={styles.sectionHeadText}>
          Contact.
        </h3>

        <form
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col gap-8"
        >
          {/* Name */}
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">
              Your Name
            </span>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              autoComplete="name"
              required
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">
              Your Email
            </span>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email address?"
              autoComplete="email"
              required
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
            />
          </label>

          {/* Message */}
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">
              Your Message
            </span>

            <textarea
              rows={7}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What you want to say?"
              required
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium resize-none"
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>

        {/* Direct Contact Links */}
        <div className="mt-10 pt-8 border-t border-[#232631]">
          <p className="text-secondary text-[14px] mb-4">
            Or reach me directly
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:lv001490@gmail.com"
              className="text-white text-[14px] px-4 py-2 rounded-lg border border-[#915EFF] hover:bg-[#915EFF] transition-colors duration-200"
            >
              Email
            </a>

            <a
              href="https://github.com/Luckyverma04"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Lucky Verma GitHub profile"
              className="text-white text-[14px] px-4 py-2 rounded-lg border border-[#915EFF] hover:bg-[#915EFF] transition-colors duration-200"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/lucky-verma-886547307/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Lucky Verma LinkedIn profile"
              className="text-white text-[14px] px-4 py-2 rounded-lg border border-[#915EFF] hover:bg-[#915EFF] transition-colors duration-200"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Lightweight Developer Card */}
      <div className="xl:flex-1 flex items-center justify-center min-h-[350px] md:min-h-[550px]">
        <div className="relative w-full max-w-[420px] h-[350px] flex items-center justify-center">
          {/* Glow */}
          <div className="absolute w-64 h-64 rounded-full bg-[#915EFF]/20 blur-3xl" />

          {/* Card */}
         
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");