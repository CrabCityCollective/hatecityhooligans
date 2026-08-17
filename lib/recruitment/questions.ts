import type { Hooligan } from "@/types";
import { pickOne } from "@/lib/gevecht/generate-team";
import type {
  InterviewQuestion,
  InterviewQuestionId,
  InterviewSignal,
  RecruitmentLocationId,
} from "./types";

export const GENERIC_QUESTIONS: InterviewQuestion[] = [
  { id: "rivaliserende-club", prompt: "Wat vind je van [rivaliserende club]?", reliable: false },
  { id: "opgroei-plek", prompt: "Waar ben je opgegroeid?", reliable: false },
  { id: "biertje", prompt: "Biertje?", reliable: false },
  { id: "baan-of-gezin", prompt: "Heb je een vaste baan of gezin?", reliable: false },
  { id: "weekend", prompt: "Wat doe je het liefst in het weekend?", reliable: false },
];

export const LOCATION_QUESTIONS: Record<RecruitmentLocationId, InterviewQuestion> = {
  sportschool: {
    id: "sportschool-vechtsport",
    prompt: "Doe je aan vechtsport?",
    location: "sportschool",
    reliable: true,
  },
  rave: {
    id: "rave-drug-van-keuze",
    prompt: "Wat is je drug van keuze vanavond?",
    location: "rave",
    reliable: true,
  },
  schoolplein: {
    id: "schoolplein-kinderen",
    prompt: "Heb je zelf kinderen?",
    location: "schoolplein",
    reliable: true,
  },
};

/** De 6 vragen die beschikbaar zijn op `location`: 5 generieke + 1 locatie-specifieke. */
export function getAvailableQuestions(location: RecruitmentLocationId): InterviewQuestion[] {
  return [...GENERIC_QUESTIONS, LOCATION_QUESTIONS[location]];
}

/** Kans dat een generieke (onbetrouwbare) vraag een misleidend/onduidelijk signaal oplevert. */
const MISLEADING_CHANCE = 0.3;

const MISLEADING_ANSWERS = [
  "Geeft een ontwijkend antwoord — hier valt weinig uit op te maken.",
  "Antwoordt zo vaag dat het weinig zegt.",
  "Lijkt de vraag liever te ontwijken.",
];

function trueAnswer(questionId: InterviewQuestionId, hooligan: Hooligan): string {
  const { traits } = hooligan;

  switch (questionId) {
    case "rivaliserende-club":
      return traits.hateTriggers.length > 2
        ? "Kookt van woede zodra de rivaliserende club ter sprake komt."
        : "Reageert vrij onverschillig op de rivaliserende club.";
    case "opgroei-plek":
      if (traits.background.includes("woont-in-dorp")) {
        return "Vertelt over een jeugd in een klein dorp.";
      }
      if (traits.background.includes("opgegroeid-in-stad")) {
        return "Vertelt over een jeugd in de grote stad.";
      }
      return "Geeft een vaag antwoord over waar die is opgegroeid.";
    case "biertje":
      return traits.hasAlcoholProblem
        ? "Slaat het biertje niet af — en het volgende ook niet."
        : "Neemt hooguit één biertje.";
    case "baan-of-gezin":
      if (traits.background.includes("heeft-een-gezin")) return "Praat trots over het gezin.";
      if (traits.background.includes("kantoorbaan")) return "Vertelt over een vaste kantoorbaan.";
      if (traits.background.includes("bijbaantje")) return "Heeft een bijbaantje, verder niets vast.";
      return "Heeft geen vaste baan of gezin.";
    case "weekend":
      switch (traits.substancePreference) {
        case "wiet":
          return "Chillt het liefst met een jointje.";
        case "cocaine":
          return "Gaat stevig door in het weekend, duidelijk meer dan alleen drank.";
        case "alcohol":
          return "Gaat vooral stevig door met drank.";
        case "xtc":
          return "Gaat het liefst een heel weekend door op een feestje.";
        default:
          return "Houdt het rustig in het weekend.";
      }
    case "sportschool-vechtsport":
      if (traits.background.includes("kickboksen")) return "Zit al jaren op kickboksen.";
      if (traits.background.includes("karate")) return "Traint fanatiek karate.";
      return "Doet niet aan vechtsport.";
    case "rave-drug-van-keuze":
      if (traits.substancePreference === "xtc") return "Is duidelijk gek op xtc.";
      if (traits.substancePreference) return `Geeft de voorkeur aan ${traits.substancePreference}.`;
      return "Blijft nuchter vanavond.";
    case "schoolplein-kinderen":
      return traits.background.includes("heeft-een-gezin")
        ? "Heeft zelf kinderen op dit schoolplein."
        : "Heeft geen kinderen.";
  }
}

/**
 * Genereert het signaal dat de speler te zien krijgt voor `question`. Generieke vragen hebben een
 * kans op een misleidend/onduidelijk antwoord; de locatie-specifieke vraag is altijd betrouwbaar
 * (design §6).
 */
export function answerQuestion(question: InterviewQuestion, hooligan: Hooligan): InterviewSignal {
  const misleading = !question.reliable && Math.random() < MISLEADING_CHANCE;
  const answer = misleading ? pickOne(MISLEADING_ANSWERS) : trueAnswer(question.id, hooligan);

  return { questionId: question.id, question: question.prompt, answer, misleading };
}
