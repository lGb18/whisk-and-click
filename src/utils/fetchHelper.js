export const withTimeout = (promise, ms = 6000) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('SUPABASE_HANG')), ms)
  );
  return Promise.race([promise, timeoutPromise]);
};