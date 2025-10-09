// Taygo phrases - can appear in any column
const phrases = [
  "appwrite hero",
  "mentions not being technical",
  "pepsi pat",
  "mentions hiring jason",
  '"chat is blowing up / crazy"',
  '"awesome"',
  "service industry being this gen's war",
  "AI mentioned",
  "torc discord mentioned",
  '"i love it"',
  "mentions the stream being a virtual meetup",
  '"I would put my network up against anybody\'s"',
  "ambassador program",
  "text updates not being spam",
  '"we need a part two"',
  "cold brew",
  "mentions a conference talk",
  "dads in tech mentioned",
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
  '"content creation"',
  "your comment or you get shouted out",
  "jason roasts taylor in chat",
  "roxy's height mentioned",
  "brand building",
  "taco bell mentioned",
  "outback steakhouse mentioned",
  "talks about sailing",
  "mentions his wife",
  '"enough of me yappin"',
  '"set the stage"',
  "hockey mentioned",
  "golf mentioned",
  "covid mentioned",
  "pre-2022 job market",
  '"soft skills"',
  "DM'ing people",
  '"hot take"',
  '"grind"',
  '"rapid fire"',
  "cursor",
  '"mcp"',
  '"agentic"',
  "claude",
  "openai",
  "vscode",
  "vim/neovim",
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
