// web crawler

export const matchRegex = async (url: string, regex: any) => {
  const res = await fetch(url);
  const htmlPage = await res.text();
  const matches: any = [];

  let match;
  while ((match = regex.exec(htmlPage))) {
    matches.push(match[1]);
  }
  //console.log(matches);
  return matches;
};

export const pause = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
