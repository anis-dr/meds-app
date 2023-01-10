interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  startedTaking: string;
  time: Time[];
}

interface Time {
  time: string;
  taken: boolean;
}

interface Routine {
  name: string;
  medications: Medication[];
  times: Time[];
}
