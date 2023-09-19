export const matchRegex = async (url: string, regex: any) => {
  const htmlPage = await fetch(url);
  const matches = [];
  let match;
  while ((match = regex.exec(htmlPage))) {
    matches.push(match[1]);
  }
  return matches;
};

export const pause = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
