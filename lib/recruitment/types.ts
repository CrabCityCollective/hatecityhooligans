export type RecruitmentLocationId = "sportschool" | "rave" | "schoolplein";

export interface RecruitmentLocation {
  id: RecruitmentLocationId;
  name: string;
  /** Korte omschrijving van de trait-bias, getoond bij de locatiekeuze. */
  description: string;
}

export type GenericQuestionId =
  | "rivaliserende-club"
  | "opgroei-plek"
  | "biertje"
  | "baan-of-gezin"
  | "weekend";

export type LocationQuestionId =
  | "sportschool-vechtsport"
  | "rave-drug-van-keuze"
  | "schoolplein-kinderen";

export type InterviewQuestionId = GenericQuestionId | LocationQuestionId;

export interface InterviewQuestion {
  id: InterviewQuestionId;
  prompt: string;
  /** Alleen gezet voor de locatie-specifieke vraag. */
  location?: RecruitmentLocationId;
  /** Locatie-specifieke vragen zijn betrouwbaarder dan generieke (design §6). */
  reliable: boolean;
}

export interface InterviewSignal {
  questionId: InterviewQuestionId;
  question: string;
  /** Antwoord/signaal zoals getoond aan de speler — kan misleidend zijn bij onbetrouwbare vragen. */
  answer: string;
  misleading: boolean;
}
