"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import Header from "../../components/header/header";
import { readAuthSession } from "../../utils/auth-session";
import {
  getApiErrorMessage,
  getCurrentCommunityUser,
  sendMessage,
  useCommunityStore,
} from "../../utils/community-store";

export default function MessagesPage() {
  const session = readAuthSession();
  const state = useCommunityStore();
  const currentUser = getCurrentCommunityUser(state, session);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const recipient =
    selectedRecipient ||
    state.users.find((user) => user.id !== currentUser.id)?.id ||
    "";

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!recipient || !messageText.trim()) {
      toast.error("Select a recipient and enter a message first.");
      return;
    }

    setIsSending(true);
    try {
      await sendMessage({
        recipientId: recipient,
        text: messageText.trim(),
      });
      setMessageText("");
      await state.refresh();
      toast.success("Message sent.");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to send message."));
    } finally {
      setIsSending(false);
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
            <span className="section-label text-primary! mb-6!">
              Interaction / Messaging
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl tracking-tight leading-[1.1]">
              Keep support moving through <span className="text-teal-400">direct</span> communication.
            </h1>
            <p className="text-white/70 font-medium text-lg md:text-xl leading-relaxed max-w-3xl">
              Basic messaging gives helpers and requesters a clear follow-up
              path once a match happens.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="premium-card h-full">
                <span className="section-label text-text-muted">
                  Conversation Stream
                </span>
                <h2 className="text-3xl font-bold text-dark mb-10">
                  Recent messages
                </h2>

                <div className="flex flex-col gap-6">
                  {state.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-6 md:p-8 rounded-3xl bg-white/60 border border-black/5 hover:bg-white hover:shadow-xl transition-all cursor-pointer group hover:border-primary/20"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="avatar w-10! h-10! text-xs">
                            {msg.from[0]}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-dark group-hover:text-primary transition-colors">
                                {msg.from}
                              </span>
                              <span className="text-text-muted text-xs">?</span>
                              <span className="font-bold text-dark text-sm">{msg.to}</span>
                            </div>
                            <span className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest">
                              Direct Message
                            </span>
                          </div>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-white text-[10px] font-bold text-primary border border-primary/10 shadow-sm">
                          {msg.time}
                        </div>
                      </div>
                      <p className="text-text-muted text-[15px] leading-relaxed group-hover:text-dark transition-colors pl-1">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="premium-card h-full bg-bg-card border-none shadow-none">
                <span className="section-label text-primary">Send Message</span>
                <h2 className="text-3xl font-bold text-dark mb-10">
                  Start a conversation
                </h2>

                <form className="flex flex-col gap-8" onSubmit={handleSend}>
                  <div className="flex flex-col gap-3">
                    <label className="section-label text-dark/60">To</label>
                    <div className="relative">
                      <select
                        className="form-select"
                        value={recipient}
                        onChange={(event) => setSelectedRecipient(event.target.value)}
                      >
                        {state.users
                          .filter((user) => user.id !== currentUser.id)
                          .map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                      </select>
                      <ChevronDown
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-dark/40 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="section-label text-dark/60">Message</label>
                    <textarea
                      rows={6}
                      placeholder="Share support details, ask for files, or suggest next steps."
                      className="form-input resize-none"
                      value={messageText}
                      onChange={(event) => setMessageText(event.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center py-5 text-base mt-4 shadow-lg shadow-primary/20"
                    disabled={isSending}
                  >
                    {isSending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    {isSending ? "Sending..." : "Send message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

