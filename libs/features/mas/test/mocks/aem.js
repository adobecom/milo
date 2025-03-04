export async function withAem(originalFetch) {
  return async ({ pathname, searchParams }) => {
      if (/\/mas\/io\/fragment/.test(pathname)) {
          const fragmentId = searchParams.get('id');
          if (fragmentId === 'notfound') {
              return Promise.resolve({
                  ok: false,
                  status: 404,
                  statusText: 'Fragment not found',
              });
          }
          return await originalFetch(`/test/mocks/sites/fragments/${fragmentId}.json`).then((res) => {
              if (res.ok) return res;
              throw new Error(
                  `Failed to get fragment: ${res.status} ${res.statusText}`,
              );
          });
      }
      return false;
  };
}
