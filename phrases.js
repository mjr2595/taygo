// Taygo phrases - can appear in any column
const phrases = [
  "appwrite hero",
  "mentions not being technical",
  "pepsi pat",
  "hiring jason story",
  "chat is blowing up / crazy",
  "awesome",
  "service industry being this gen's war",
  "AI mentioned",
  "torc discord",
  "i love it",
  "the stream being a virtual meetup",
  "I would put my network up against anybody's",
  "ambassador program",
  "text updates not being spam",
  "we need a part two",
  "cold brew",
  "coffee",
  "conference talk",
  "dads in tech",
  "recruiters taking 7s to read resume",
  "react js",
  ".NET",
  "laravel",
  "javascript",
  "react",
  "vue",
  "angular",
  "svelte",
  "java",
  "python",
  "ruby",
  "content creation",
  "you or your comment shouted out",
  "jason roasts taylor in chat",
  "roxy's height",
  "brand building",
  "taco bell",
  "outback steakhouse",
  "talks about sailing",
  "mentions his wife",
  "enough of me yappin",
  "set the stage",
  "hockey",
  "golf",
  "covid",
  "pre-2022 job market",
  "soft skills",
  "DM'ing people",
  "hot take",
  "grind",
  "rapid fire",
  "cursor",
  "mcp",
  "agentic",
  "claude",
  "openai",
  "vscode",
  "vim or neovim",
  "let's give the people what they want",
  "practical, tactical",
  "unnecessary hand gestures",
  "open source",
  "tech twitter",
  "interviewing sucks",
  "senior, staff, principal engineer",
  "raise or promotion",
  "rejection",
  "vaco",
  "gun.io",
];

// Function to get random phrases for a column
function generatePhraseColumn(usedPhrases = new Set()) {
  const columnPhrases = [];
  const availablePhrases = phrases.filter((phrase) => !usedPhrases.has(phrase));

  // If we don't have enough unused phrases, reset and use any
  const phrasesToUse =
    availablePhrases.length >= 5 ? availablePhrases : phrases;

  while (columnPhrases.length < 5) {
    const randomIndex = Math.floor(Math.random() * phrasesToUse.length);
    const phrase = phrasesToUse[randomIndex];

    if (!columnPhrases.includes(phrase)) {
      columnPhrases.push(phrase);
      usedPhrases.add(phrase);
    }
  }

  return columnPhrases;
}
