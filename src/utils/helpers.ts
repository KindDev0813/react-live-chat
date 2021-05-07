export const getMaxKey = (obj: any) => {
  const res = Object.keys(obj).map((i) => parseInt(i));
  const max = Math.max(...res);
  if (max === -Infinity) return 0;
  else return Math.max(...res);
};

export const getKeyOfRoom = (resData: any, roomId: string) => {
  const keys = Object.keys(resData);
  const values = Object.values(resData);
  const index = values.map((item: any) => item.roomId).indexOf(roomId);
  return parseInt(keys[index]);
};
