"use client";

// Owns the shared coordinate space: renders the tree (CircuitVines) and, on
// desktop, the fruit-cards hanging from the tree's real branch-tip anchors.

import { useCallback, useState } from "react";
import CircuitVines from "./CircuitVines";
import FruitOverlay from "./FruitOverlay";

type Anchor = { x: number; y: number };

export default function HomeTree({ projects }: { projects: any[] }) {
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const onAnchors = useCallback((a: Anchor[]) => setAnchors(a), []);
  return (
    <>
      <CircuitVines fruitCount={projects.length} onAnchors={onAnchors} />
      <FruitOverlay projects={projects} anchors={anchors} />
    </>
  );
}
