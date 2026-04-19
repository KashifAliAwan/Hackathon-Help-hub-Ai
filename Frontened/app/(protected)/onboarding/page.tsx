"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, User, MapPin, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import Header from "../../components/header/header";
import { readAuthSession } from "../../utils/auth-session";
import {
  getApiErrorMessage,
  getCurrentCommunityUser,
  updateCurrentUserProfile,
  useCommunityStore,
} from "../../utils/community-store";

const suggestedSkills = [
  "React",
  "Node.js",
  "Figma",
  "UI/UX",
  "Python",
  "Data Science",
  "AWS",
  "DevOps",
  "Next.js",
  "Tailwind",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const session = readAuthSession();
  const state = useCommunityStore();
  const currentUser = getCurrentCommunityUser(state, session);
  const [name, setName] = useState(currentUser.name);
  const [location, setLocation] = useState(currentUser.location);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentUser.skills.length ? currentUser.skills : ["React", "Figma"],
  );
  const [isFinishing, setIsFinishing] = useState(false);

  const nextStep = () => {
    if (step === 1 && (!name.trim() || !location.trim())) {
      toast.error("Please complete your name and location first.");
      return;
    }

    if (step === 2 && selectedSkills.length === 0) {
      toast.error("Select at least one skill before continuing.");
      return;
    }

    setStep((current) => current + 1);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill],
    );
  };

  const finish = async () => {
    if (isFinishing) {
      return;
    }

    setIsFinishing(true);
    try {
      await updateCurrentUserProfile({
        name: name.trim(),
        location: location.trim(),
        skills: selectedSkills,
        interests: currentUser.interests.length
          ? currentUser.interests
          : ["Community Growth", "Peer Learning"],
      });
      await state.refresh();
      toast.success("Onboarding saved. Dashboard ready.");
      router.push("/dashboard");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to save onboarding."));
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="grow container mx-auto px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl flex flex-col gap-12">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s === step ? "w-12 bg-primary" : s < step ? "w-8 bg-primary/40" : "w-8 bg-black/5"
                }`}
              />
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="premium-card p-12 lg:p-16 bg-white shadow-2xl shadow-black/5"
          >
            {step === 1 ? (
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <span className="section-label text-primary">
                    Step 01 / Identity
                  </span>
                  <h1 className="text-5xl font-bold text-dark leading-tight">
                    Welcome to the
                    <br />
                    community, friend.
                  </h1>
                  <p className="text-text-muted text-lg max-w-2xl">
                    Let&apos;s start by setting up your basic profile
                    information so people know who they&apos;re helping.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-dark/60 uppercase tracking-wide">
                      Display Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="form-input pl-12"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Ayesha Khan"
                      />
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30"
                        size={18}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-dark/60 uppercase tracking-wide">
                      Your Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="form-input pl-12"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="e.g. Karachi, PK"
                      />
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/30"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  className="btn-primary self-end py-4 px-12 text-base group"
                >
                  Next step
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <span className="section-label text-primary">
                    Step 02 / Expertise
                  </span>
                  <h1 className="text-5xl font-bold text-dark leading-tight">
                    What do you bring
                    <br />
                    to the table?
                  </h1>
                  <p className="text-text-muted text-lg max-w-2xl">
                    Select the skills you can offer help with, or the areas
                    where you&apos;re looking to grow.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {suggestedSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);

                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-6 py-3 rounded-2xl border font-bold transition-all ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                            : "bg-bg-card border-black/5 text-dark hover:border-primary/40 hover:bg-white"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-text-muted font-bold hover:text-dark transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary py-4 px-12 text-base group"
                  >
                    Continue
                    <ChevronRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="flex flex-col gap-10 text-center items-center">
                <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-4">
                  <Sparkles size={48} />
                </div>
                <div className="flex flex-col gap-4">
                  <span className="section-label text-primary mx-auto">
                    Step 03 / Ready
                  </span>
                  <h1 className="text-5xl font-bold text-dark leading-tight">
                    You&apos;re all set!
                  </h1>
                  <p className="text-text-muted text-lg max-w-xl mx-auto">
                    Your community profile is ready. You can now start exploring
                    requests or posting your own challenges.
                  </p>
                </div>

                <div className="premium-card bg-bg-card border-none shadow-none p-8 w-full max-w-lg text-left flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <div className="font-bold text-dark text-xl leading-tight">
                      Profile optimized
                    </div>
                    <div className="text-text-muted font-medium">
                      {selectedSkills.length} skills selected and synced
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={finish}
                  className="btn-primary py-5 px-16 text-lg shadow-xl shadow-primary/20"
                  disabled={isFinishing}
                >
                  {isFinishing ? <Loader2 size={18} className="animate-spin" /> : null}
                  {isFinishing ? "Saving..." : "Go to Dashboard"}
                </button>
              </div>
            ) : null}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

