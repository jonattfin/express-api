export function withDelay(data, delay = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay * 1000);
  });
}
