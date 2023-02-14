import { useState } from '../../../libs/deps/htm-preact.js';

export default function useShowingSubproject() {
  const [showingSubproject, setShowingSubproject] = useState(false);
  return { showingSubproject, setShowingSubproject };
}
