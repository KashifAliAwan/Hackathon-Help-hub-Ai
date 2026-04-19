"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, ChevronDown, Loader2, Wand2 } from "lucide-react";
import { toast } from "react-toastify";

import Header from "../../components/header/header";
import { readAuthSession } from "../../utils/auth-session";
import {
  createRequest,
  detectUrgency,
  getApiErrorMessage,
  getCurrentCommunityUser,
  rewriteDescription,
  suggestCategory,
  suggestTags,
  useCommunityStore,
} from "../../utils/community-store";

type FormValues = {
  title: string;
  description: string;
  tags: string;
  category: string;
  urgency: "Critical" | "High" | "Medium" | "Low";
};

export default function CreateRequestPage() {
  const router = useRouter();
  const session = readAuthSession();
  const state = useCommunityStore();
  const currentUser = getCurrentCommunityUser(state, session);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<FormValues>({
    title: "",
    description: "",
    tags: "",
    category: "Community",
    urgency: "Low",
  });

  const suggestionInput = `${values.title} ${values.description}`.trim();
  const aiPanel = useMemo(() => {
    const suggestedTags = suggestTags(suggestionInput);
    const suggestionCategory = suggestCategory(suggestionInput);
    const suggestionUrgency = detectUrgency(suggestionInput);
    const rewritten = rewriteDescription(values.description);

    return {
      category: suggestionCategory,
      urgency: suggestionUrgency,
      tags: suggestedTags,
      rewritten,
    };
  }, [suggestionInput, values.description]);

  const updateField = <T extends keyof FormValues>(
    field: T,
    value: FormValues[T],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const applySuggestions = () => {
    setValues((current) => ({
      ...current,
      category: aiPanel.category,
      urgency: aiPanel.urgency,
      tags: aiPanel.tags.join(", "),
      description: aiPanel.rewritten || current.description,
    }));
    toast.success("AI suggestions applied to your request.");
  };

  const publishRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.title.trim() || !values.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newRequest = await createRequest({
        title: values.title.trim(),
        description: values.description.trim(),
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        category: values.category,
        urgency: values.urgency,
        location: currentUser.location,
      });

      await state.refresh();
      toast.success("Request published successfully.");
      router.push(`/requests/${newRequest.id}`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to publish request."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="grow container mx-auto px-6 py-12">
        <div className="flex flex-col gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card-dark p-8 md:p-12 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
            <span className="section-label text-primary! mb-6!">Create Request</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl tracking-tight leading-[1.1]">
              Turn a rough problem into a <span className="text-teal-400">clear</span> help request.
            </h1>
            <p className="text-white/70 font-medium text-lg md:text-xl leading-relaxed max-w-3xl">
              Use built-in AI suggestions for category, urgency, tags, and a
              stronger description rewrite.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="premium-card h-full bg-white">
                <form className="flex flex-col gap-8" onSubmit={publishRequest}>
                  <div className="flex flex-col gap-3">
                    <label className="section-label text-dark/60">Title</label>
                    <input
                      type="text"
                      placeholder="Need review on my JavaScript quiz app before submission"
                      className="form-input form-input-muted"
                      value={values.title}
                      onChange={(event) => updateField("title", event.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="section-label text-dark/60">
                      Description
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Explain the challenge, your current progress, deadline, and what kind of help would be useful."
                      className="form-input form-input-muted resize-none"
                      value={values.description}
                      onChange={(event) => updateField("description", event.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <label className="section-label text-dark/60">Tags</label>
                      <input
                        type="text"
                        placeholder="JavaScript, Debugging, Review"
                        className="form-input form-input-muted"
                        value={values.tags}
                        onChange={(event) => updateField("tags", event.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="section-label text-dark/60">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          className="form-select form-input-muted"
                          value={values.category}
                          onChange={(event) => updateField("category", event.target.value)}
                        >
                          <option value="Web Development">Web Development</option>
                          <option value="Design">Design</option>
                          <option value="Career">Career</option>
                          <option value="Academics">Academics</option>
                          <option value="Content">Content</option>
                          <option value="Community">Community</option>
                        </select>
                        <ChevronDown
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-dark/40 pointer-events-none"
                          size={18}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="section-label text-dark/60">Urgency</label>
                    <div className="relative">
                      <select
                        className="form-select form-input-muted pr-12!"
                        value={values.urgency}
                        onChange={(event) =>
                          updateField(
                            "urgency",
                            event.target.value as FormValues["urgency"],
                          )
                        }
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <ChevronDown
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-dark/40 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 mt-6 pt-6 border-t border-black/5">
                    <button
                      type="button"
                      className="btn-secondary py-4! px-8! text-sm flex items-center gap-2 group"
                      onClick={applySuggestions}
                    >
                      <Wand2
                        size={16}
                        className="text-primary group-hover:rotate-12 transition-transform"
                      />
                      Apply AI suggestions
                    </button>
                    <button
                      type="submit"
                      className="btn-primary py-4! px-10! text-sm shadow-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                      {isSubmitting ? "Publishing..." : "Publish request"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="premium-card h-full bg-bg-card border-none shadow-none p-12">
                <span className="section-label text-primary">AI Assistant</span>
                <h2 className="text-4xl font-bold text-dark mb-12 leading-tight">
                  Smart request guidance
                </h2>

                <div className="flex flex-col gap-8">
                  {[
                    { label: "Suggested category", value: aiPanel.category },
                    { label: "Detected urgency", value: aiPanel.urgency },
                    {
                      label: "Suggested tags",
                      value:
                        aiPanel.tags.join(", ") ||
                        "Add more detail for smarter tags",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-5 border-b border-black/5 gap-4"
                    >
                      <span className="text-text-muted font-bold text-sm">
                        {item.label}
                      </span>
                      <span className="font-bold text-dark text-sm text-right">
                        {item.value}
                      </span>
                    </div>
                  ))}

                  <div className="flex flex-col gap-4 py-5">
                    <span className="section-label text-text-muted opacity-60">
                      Rewrite suggestion
                    </span>
                    <p className="text-dark font-bold text-base leading-relaxed">
                      {aiPanel.rewritten ||
                        "Start describing the challenge to generate a stronger version of your request."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

