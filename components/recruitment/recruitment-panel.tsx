"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/store/use-game-store";
import { RECRUITMENT_LOCATION_LIST } from "@/lib/recruitment/locations";
import { generateCandidate } from "@/lib/recruitment/generate-candidate";
import { answerQuestion, getAvailableQuestions } from "@/lib/recruitment/questions";
import type { InterviewQuestion, InterviewSignal, RecruitmentLocationId } from "@/lib/recruitment/types";
import type { Hooligan } from "@/types";

/** Speler kiest 3 van de 6 beschikbare vragen om te stellen (design §6). */
const QUESTIONS_TO_ASK = 3;

export function RecruitmentPanel() {
  const notoriety = useGameStore((state) => state.gang.notoriety);
  const addHooligan = useGameStore((state) => state.addHooligan);

  const [location, setLocation] = useState<RecruitmentLocationId | null>(null);
  const [candidate, setCandidate] = useState<Hooligan | null>(null);
  const [signals, setSignals] = useState<InterviewSignal[]>([]);
  const [decision, setDecision] = useState<"aangenomen" | "afgewezen" | null>(null);

  function visitLocation(locationId: RecruitmentLocationId) {
    setLocation(locationId);
    setCandidate(generateCandidate(locationId, notoriety));
    setSignals([]);
    setDecision(null);
  }

  function askQuestion(question: InterviewQuestion) {
    if (!candidate || signals.length >= QUESTIONS_TO_ASK) return;
    setSignals((prev) => [...prev, answerQuestion(question, candidate)]);
  }

  function decide(accept: boolean) {
    if (!candidate) return;
    if (accept) addHooligan(candidate);
    setDecision(accept ? "aangenomen" : "afgewezen");
  }

  function bezoekAndereLocatie() {
    setLocation(null);
    setCandidate(null);
    setSignals([]);
    setDecision(null);
  }

  const askedIds = new Set(signals.map((signal) => signal.questionId));
  const interviewKlaar = signals.length >= QUESTIONS_TO_ASK;
  const questions = location ? getAvailableQuestions(location) : [];

  return (
    <section>
      <h2>Recruitment</h2>

      {!candidate && (
        <ul>
          {RECRUITMENT_LOCATION_LIST.map((loc) => (
            <li key={loc.id}>
              <button type="button" onClick={() => visitLocation(loc.id)}>
                {loc.name}
              </button>{" "}
              <span>{loc.description}</span>
            </li>
          ))}
        </ul>
      )}

      {candidate && (
        <div>
          <p>Kandidaat: {candidate.name}</p>

          {!decision && !interviewKlaar && (
            <>
              <p>
                Kies {QUESTIONS_TO_ASK - signals.length} van de resterende vragen (
                {signals.length}/{QUESTIONS_TO_ASK} gesteld):
              </p>
              <ul>
                {questions.map((question) => (
                  <li key={question.id}>
                    <button
                      type="button"
                      disabled={askedIds.has(question.id)}
                      onClick={() => askQuestion(question)}
                    >
                      {question.prompt}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {signals.length > 0 && (
            <ul>
              {signals.map((signal) => (
                <li key={signal.questionId}>
                  <strong>{signal.question}</strong> — {signal.answer}
                </li>
              ))}
            </ul>
          )}

          {!decision && interviewKlaar && (
            <p>
              <button type="button" onClick={() => decide(true)}>
                Aannemen
              </button>{" "}
              <button type="button" onClick={() => decide(false)}>
                Afwijzen
              </button>
            </p>
          )}

          {decision && (
            <div>
              <p>
                {decision === "aangenomen"
                  ? "Aangenomen! Volledige traits:"
                  : "Afgewezen. Volledige traits:"}
              </p>
              <TraitsReveal hooligan={candidate} />
              <p>
                <button type="button" onClick={bezoekAndereLocatie}>
                  Nieuwe locatie bezoeken
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function TraitsReveal({ hooligan }: { hooligan: Hooligan }) {
  const { traits } = hooligan;

  return (
    <dl>
      <dt>Achtergrond</dt>
      <dd>{traits.background.length > 0 ? traits.background.join(", ") : "geen"}</dd>
      <dt>Middel</dt>
      <dd>{traits.substancePreference ?? "geen voorkeur"}</dd>
      <dt>Alcoholprobleem</dt>
      <dd>{traits.hasAlcoholProblem ? "ja" : "nee"}</dd>
      <dt>Haat-triggers</dt>
      <dd>{traits.hateTriggers.join(", ")}</dd>
      <dt>Zichtbare eigenschappen</dt>
      <dd>{traits.visibleTraits.length > 0 ? traits.visibleTraits.join(", ") : "geen"}</dd>
    </dl>
  );
}
