// Stand-in for federal's remote gnav main.js, wired in via the import map in
// global-navigation.test.html. Records every args object handed to main() so
// the test can assert exactly what the C2 wrapper wires through.
export const calls = [];

export async function main(args) {
  calls.push(args);
  return {};
}
