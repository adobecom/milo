/**
 * Concurrency primitives. The pipeline fans out fetches and writes across
 * many geos / sites; these helpers cap parallelism to friendly limits.
 */

/**
 * Run `mapper` over `items` with at most `limit` in-flight at a time.
 * Preserves input order in the returned results array.
 * @template T, R
 * @param {T[]} items
 * @param {number} limit
 * @param {(item: T, index: number) => Promise<R>} mapper
 * @returns {Promise<R[]>}
 */
export async function mapWithConcurrency(
  items,
  limit,
  mapper,
) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      if (currentIndex >= items.length) return;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  const workerCount = Math.max(1, Math.min(limit, items.length));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}
