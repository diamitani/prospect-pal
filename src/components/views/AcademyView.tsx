"use client";

import { useState } from "react";

interface CourseProduct {
  id: string;
  title: string;
  category: string;
  icon: string;
  tagline: string;
  slidesCount: number;
  skillsAgent: string;
  description: string;
  keyTopics: string[];
  samplePrompt: string;
}

const COURSES: CourseProduct[] = [
  {
    id: "email-marketing",
    title: "Effective Marketing Emails for Any Situation",
    category: "Email Marketing & Automation",
    icon: "✉️",
    tagline: "Event sequences, holiday promos, how-to guides, and automated feedback loops.",
    slidesCount: 36,
    skillsAgent: "uysg-email-marketing",
    description:
      "Master the full email lifecycle from Save-the-Date invitations and reminder series to promotional holiday sequences and automated Google review requests using Constant Contact.",
    keyTopics: [
      "4-Part Event Sequence (Save the Date -> Invitation -> Reminder -> Follow-up)",
      "Segmenting Prospects vs. Trialers vs. Paying Customers",
      "Automated 5-Star Feedback & Review Funnels",
      "High-Converting Visual Hierarchy & Single-CTA Design",
    ],
    samplePrompt:
      "Write a 3-part event email sequence for an upcoming live product demonstration, including a Save-the-Date, an Invitation with agenda, and a 24-hour reminder.",
  },
  {
    id: "listings-reviews",
    title: "Unleash the Power of Listings & Reviews",
    category: "Local SEO & Reputation Management",
    icon: "🌟",
    tagline: "Google Business Profile optimization and automated 5-star review capture.",
    slidesCount: 22,
    skillsAgent: "uysg-listings-reviews",
    description:
      "Turn your local directory listings on Google, Yelp, and Apple Maps into an automated inbound revenue stream with frictionless review collection.",
    keyTopics: [
      "NAP (Name, Address, Phone) Consistency Across Directories",
      "The 3-Step Peak-Moment Review Capture Funnel",
      "24-Hour Negative Review De-escalation Protocol",
      "SEO Keyword Optimization via Google Posts",
    ],
    samplePrompt:
      "Draft a 2-step SMS & email review request workflow to send to clients immediately after completing a project, including a direct 1-click Google review link.",
  },
  {
    id: "ai-content",
    title: "Small Business & Nonprofit AI-Generated Content",
    category: "AI Copywriting & Repurposing",
    icon: "🤖",
    tagline: "Save 10+ hours a week using AI prompt engineering tailored to your brand voice.",
    slidesCount: 43,
    skillsAgent: "uysg-ai-content",
    description:
      "Learn how small businesses and nonprofits can ethically and effectively leverage AI to generate multi-channel campaigns, fundraising appeals, and social content in minutes.",
    keyTopics: [
      "The 4-Part AI Prompt Structure (Role, Goal, Tone, Constraints)",
      "Multi-Channel Repurposing (1 Article -> 10 Social Posts + 1 Newsletter)",
      "Nonprofit Impact Storytelling & Donor Gratitude Sequences",
      "Brand Voice Alignment & Ethical Guidelines",
    ],
    samplePrompt:
      "You are an expert copywriter for a community nonprofit. Write a 3-paragraph donation email for our annual back-to-school drive highlighting our $50 impact tier.",
  },
  {
    id: "social-media",
    title: "Social Media Mastery: Top Questions Answered",
    category: "Multi-Platform Growth",
    icon: "📱",
    tagline: "Posting cadences, optimal time grids, and short-form video conversion hooks.",
    slidesCount: 50,
    skillsAgent: "uysg-social-media",
    description:
      "Eliminate the guesswork of social media. Master platform cadences (Facebook, Instagram, LinkedIn, X, TikTok) and the 30-second short-form video conversion formula.",
    keyTopics: [
      "Platform Cadences (Facebook 3-7/wk, Instagram 1/day, TikTok 1-4/day)",
      "Peak Engagement Time Heatmaps",
      "The 3-Part Video Formula (Hook -> Value -> CTA in under 30s)",
      "Turning Social Engagement into Direct Email Subscribers",
    ],
    samplePrompt:
      "Create a 7-day social media content calendar for LinkedIn and Instagram with optimal posting times and video hook ideas for a B2B sales automation consultancy.",
  },
  {
    id: "sms-marketing",
    title: "Text (SMS) Marketing for Sales & Engagement",
    category: "Mobile & Direct Outreach",
    icon: "📲",
    tagline: "Compliant, high-open-rate text marketing for flash sales and appointments.",
    slidesCount: 39,
    skillsAgent: "uysg-sms-marketing",
    description:
      "Harness the 98% open rates of SMS marketing. Learn TCPA compliance, opt-in disclaimers, urgent broadcast copy, and automated appointment reminders.",
    keyTopics: [
      "SMS Compliance Dos & Don'ts (Explicit Consent & Opt-out Disclaimers)",
      "Flash Sale VIP Text Broadcasts (Under 160 characters)",
      "Automated Appointment Confirmation & 1-Hour Reminders",
      "Balancing SMS Frequency with Email Nurture",
    ],
    samplePrompt:
      "Draft a compliant VIP flash-sale SMS broadcast under 160 characters with opt-out disclaimer and a high-urgency weekend discount code.",
  },
  {
    id: "sales-101",
    title: "Intro Sales 101: Unleash Your Sales Greatness",
    category: "Master Sales Enablement Program",
    icon: "🏆",
    tagline: "The complete sales fundamentals playbook for entrepreneurs and reps.",
    slidesCount: 28,
    skillsAgent: "unleash-your-sales-greatness",
    description:
      "The foundational sales training curriculum: energy and mindset mastery, 80/20 rapport building, the 30-second elevator pitch, cold calling phone scripts, and gatekeeper navigation.",
    keyTopics: [
      "Energy Triad: Physical Fitness, Positivity, Mindset",
      "80/20 Rapport Building & The 'YES' Momentum Rule",
      "Writing the 30-Second Elevator Pitch & Phone Script",
      "Cold Calling Strategy & Gatekeeper Bypass Techniques",
    ],
    samplePrompt:
      "Write a phone cold calling script for a sales rep reaching out to a VP of Sales, incorporating the 30-second elevator pitch and an objection handler for 'Send me an email.'",
  },
];

export default function AcademyView() {
  const [selectedCourse, setSelectedCourse] = useState<CourseProduct>(COURSES[0]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div style={{ padding: "28px 36px", maxWidth: 1150, margin: "0 auto", overflowY: "auto", height: "100%" }}>
      {/* Partner Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0f2d0f 0%, #1c5a1c 100%)",
        borderRadius: 18,
        padding: "24px 30px",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 28,
        boxShadow: "0 4px 15px rgba(28,90,28,0.25)",
      }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", background: "rgba(255,255,255,0.15)", borderRadius: 100, fontSize: 11, fontWeight: 700, marginBottom: 10 }}>
            <span>⭐</span> Unleash Your Sales Greatness Partner Suite
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
            Digital Products, Training Courses & Sub-Agent Skills
          </h1>
          <p style={{ fontSize: 13, color: "#dcf0dc", margin: 0, lineHeight: 1.5 }}>
            Accelerate your revenue with the official Unleash Your Sales Greatness curriculum. Integrate these 5 digital product skills directly into your automated workflows or launch with Constant Contact.
          </p>
        </div>
        <a
          href="https://www.constantcontact.com/signup?pn=unleashyoursalesgreatness"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "12px 24px",
            background: "#4ADE80",
            color: "#0f2d0f",
            fontWeight: 800,
            fontSize: 13,
            borderRadius: 10,
            textDecoration: "none",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>🚀</span> Launch with Constant Contact →
        </a>
      </div>

      {/* Grid of Courses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 24 }}>
        {/* Course List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#111", marginBottom: 2 }}>
            📚 Available Digital Products & Courses ({COURSES.length})
          </div>
          {COURSES.map((course) => {
            const isSelected = selectedCourse.id === course.id;
            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: isSelected ? "2px solid #1c5a1c" : "1px solid #eceae4",
                  background: isSelected ? "#f0f9f0" : "white",
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  boxShadow: isSelected ? "0 2px 8px rgba(28,90,28,0.12)" : "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{course.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isSelected ? "#1c5a1c" : "#6B7280", textTransform: "uppercase" }}>
                    {course.category}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: isSelected ? "#1c5a1c" : "#111", margin: "2px 0 4px" }}>
                    {course.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4 }}>
                    {course.tagline}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Course Deep-Dive & Sub-Agent Card */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #eceae4", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{selectedCourse.icon}</span>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 900, color: "#111", margin: 0 }}>
                  {selectedCourse.title}
                </h2>
                <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>
                  {selectedCourse.slidesCount} Slides Deck · Sub-Agent: <code style={{ color: "#1c5a1c", fontWeight: 700 }}>{selectedCourse.skillsAgent}</code>
                </span>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", background: "#f4f3ef", borderRadius: 100, color: "#374151" }}>
              Digital Product Module
            </span>
          </div>

          <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, margin: "0 0 18px" }}>
            {selectedCourse.description}
          </p>

          {/* Key Topics */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#111", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.03em" }}>
              🎯 Core Curriculum & Deliverables:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {selectedCourse.keyTopics.map((topic, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#374151", background: "#fafaf8", padding: "8px 12px", borderRadius: 8, border: "1px solid #f4f3ef" }}>
                  <span style={{ color: "#1c5a1c", fontWeight: 800 }}>✓</span>
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-Agent Execution Prompt */}
          <div style={{ background: "#111827", borderRadius: 12, padding: 16, color: "white", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80", textTransform: "uppercase" }}>
                ⚡ Sub-Agent Execution Prompt
              </span>
              <button
                onClick={() => copyPrompt(selectedCourse.samplePrompt)}
                style={{ background: "none", border: "none", color: copiedPrompt ? "#4ADE80" : "#9CA3AF", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
              >
                {copiedPrompt ? "✓ Copied" : "Copy Prompt"}
              </button>
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.5, color: "#E5E7EB", fontFamily: "monospace" }}>
              {selectedCourse.samplePrompt}
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <a
              href="https://www.constantcontact.com/signup?pn=unleashyoursalesgreatness"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 18px",
                background: "#1c5a1c",
                color: "white",
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>⭐</span> Enroll & Deploy Campaign →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
