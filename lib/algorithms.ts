// Levenshtein distance for WER calculation
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + 1
        );
      }
    }
  }

  return dp[m][n];
}

// Tokenize text into words
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

// Calculate Word Error Rate (WER)
export function calculateWER(reference: string, hypothesis: string): number {
  const refTokens = tokenize(reference);
  const hypTokens = tokenize(hypothesis);

  if (refTokens.length === 0) {
    return hypTokens.length === 0 ? 0 : 1;
  }

  const refStr = refTokens.join(" ");
  const hypStr = hypTokens.join(" ");

  const distance = levenshteinDistance(refStr, hypStr);
  return distance / refTokens.length;
}

// N-gram generation
function getNGrams(tokens: string[], n: number): Set<string> {
  const ngrams = new Set<string>();
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.add(tokens.slice(i, i + n).join(" "));
  }
  return ngrams;
}

// Calculate ROUGE-N (unigram or bigram overlap)
function calculateRougeN(reference: string, summary: string, n: number): number {
  const refTokens = tokenize(reference);
  const sumTokens = tokenize(summary);

  if (sumTokens.length < n || refTokens.length < n) {
    return 0;
  }

  const refNgrams = getNGrams(refTokens, n);
  const sumNgrams = getNGrams(sumTokens, n);

  let matches = 0;
  for (const ngram of sumNgrams) {
    if (refNgrams.has(ngram)) {
      matches++;
    }
  }

  return sumNgrams.size > 0 ? matches / sumNgrams.size : 0;
}

// Longest Common Subsequence for ROUGE-L
function lcsLength(str1: string[], str2: string[]): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// Calculate ROUGE-L
function calculateRougeL(reference: string, summary: string): number {
  const refTokens = tokenize(reference);
  const sumTokens = tokenize(summary);

  if (sumTokens.length === 0 || refTokens.length === 0) {
    return 0;
  }

  const lcs = lcsLength(sumTokens, refTokens);
  return lcs / sumTokens.length;
}

// Calculate all ROUGE metrics
export function calculateROUGE(reference: string, summary: string): {
  r1: number;
  r2: number;
  rl: number;
} {
  return {
    r1: calculateRougeN(reference, summary, 1),
    r2: calculateRougeN(reference, summary, 2),
    rl: calculateRougeL(reference, summary),
  };
}
