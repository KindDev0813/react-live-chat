export const getMaxKey = (obj: any) => {
  const res = Object.keys(obj).map((i) => parseInt(i));
  return Math.max(...res);
};
