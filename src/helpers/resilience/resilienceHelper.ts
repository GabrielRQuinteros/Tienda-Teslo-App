export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; baseDelayMs?: number } = {}
): Promise<T> {
  const { retries = 3, baseDelayMs = 500 } = options;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;

      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.warn(`⚠️ Intento ${attempt} fallido. Reintentando en ${delay} ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Todos los intentos fallaron.");
}