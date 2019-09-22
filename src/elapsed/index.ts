
function elapsed(fn: ()=>any, logFn: (delta: number)=>void, divisor: number=1000000000) {
  let start = process.hrtime.bigint();
  let result = fn();
  let delta = process.hrtime.bigint() - start;
  if(logFn) {
    logFn(parseFloat(delta.toString()) / divisor);
  }
  return result
};

elapsed.SECONDS = 1000000000;

export default elapsed;
