export interface RiddleQuestion {
  id: number;
  question: string;
  detailPrompt: string;
  acceptedAnswers: string[];
  explanation: string;
  hints: [string, string, string]; // [Petunjuk 1, Petunjuk 2, Jawaban Lengkap]
}
