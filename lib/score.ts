// lib/score.ts
export const calculateScore = (ratings: any[]) => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((a, r) => a + r.score, 0);
  const avg = sum / ratings.length;
  return Math.round(avg * 100 * Math.log(ratings.length + 1)) / 100;
};