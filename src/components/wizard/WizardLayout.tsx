"use client";

import Link from "next/link";
import { ChevronLeft, ArrowRight, SkipForward, Check } from "lucide-react";

export interface WizardStepMeta {
  number: number;
  title: string;
  shortLabel: string;
}

interface WizardLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
  steps?: WizardStepMeta[];
  stepTitle: string;
  stepDescription?: string;
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  onStepClick?: (step: number) => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showProgress?: boolean;
}

const DEFAULT_STEPS: WizardStepMeta[] = [
  { number: 1, title: "Intake & ICP Build-out", shortLabel: "Intake" },
  { number: 2, title: "Playbook & Docs Upload", shortLabel: "Playbook & Docs" },
  { number: 3, title: "Tool Selection", shortLabel: "Tool Stack" },
  { number: 4, title: "Generate Routine & Workflow", shortLabel: "Routine & Compile" },
];

export function WizardLayout({
  children,
  currentStep,
  totalSteps = 4,
  steps = DEFAULT_STEPS,
  stepTitle,
  stepDescription,
  onBack,
  onNext,
  onSkip,
  onStepClick,
  nextLabel = "Continue",
  nextDisabled = false,
  showProgress = true,
}: WizardLayoutProps) {
  return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", color: "#14142D" }}>
      {/* Top Header */}
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid rgba(20, 20, 45, 0.08)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Exit Link */}
          <Link
            href="/home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#58718A",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <ChevronLeft size={16} />
            <span>Back to Home</span>
          </Link>

          {/* Interactive Step Navigator */}
          {showProgress && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {steps.map((st) => {
                const isActive = st.number === currentStep;
                const isPassed = st.number < currentStep;

                return (
                  <button
                    key={st.number}
                    onClick={() => onStepClick && onStepClick(st.number)}
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: isActive
                        ? "#14142D"
                        : isPassed
                        ? "#EBEFF5"
                        : "transparent",
                      color: isActive
                        ? "#FFFFFF"
                        : isPassed
                        ? "#14142D"
                        : "#7E8B9B",
                      border: "none",
                      borderRadius: "100px",
                      padding: "6px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: isActive
                          ? "#2563EB"
                          : isPassed
                          ? "#10B981"
                          : "#D1D5DB",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {isPassed ? <Check size={11} strokeWidth={3} /> : st.number}
                    </span>
                    <span className="hidden sm:inline">{st.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Skip for now shortcut */}
          <div>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#58718A",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                }}
              >
                <span>Skip</span>
                <SkipForward size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          maxWidth: "880px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Step Header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#2563EB",
              fontFamily: "var(--font-mono, monospace)",
              marginBottom: 8,
            }}
          >
            STEP 0{currentStep} OF 0{totalSteps}
          </div>
          <h1
            style={{
              fontSize: "clamp(26px, 3.5vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#14142D",
              margin: "0 0 10px",
            }}
          >
            {stepTitle}
          </h1>
          {stepDescription && (
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#58718A", margin: 0 }}>
              {stepDescription}
            </p>
          )}
        </div>

        {/* Card Body */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            border: "1px solid rgba(20, 20, 45, 0.1)",
            boxShadow: "0 4px 20px rgba(16, 27, 45, 0.04)",
            padding: "36px",
          }}
        >
          {children}
        </div>

        {/* Bottom Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 28,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(20, 20, 45, 0.12)",
                  color: "#14142D",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "10px 20px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#58718A",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "10px 16px",
                  cursor: "pointer",
                }}
              >
                Skip for now
              </button>
            )}

            {onNext && (
              <button
                type="button"
                onClick={onNext}
                style={{
                  background: "#14142D",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "12px 28px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 4px 12px rgba(20, 20, 45, 0.18)",
                  transition: "transform 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <span>{nextLabel}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
