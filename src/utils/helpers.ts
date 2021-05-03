export const getMaxKey = (obj: any) => {
  const res = Object.keys(obj).map((i) => parseInt(i));
  return Math.max(...res);
};

export const getKeyOfRoom = (resData: any, roomId: string) => {
  const values = Object.values(resData);
  const index = values.map((item: any) => item.roomId).indexOf(roomId);
  return index + 1;
};
