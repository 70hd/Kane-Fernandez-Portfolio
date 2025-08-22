import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function TextCursor({ text, pos, visible }) {
  const x = useSpring(0, { stiffness: 300, damping: 28, mass: 0.2 });
  const y = useSpring(0, { stiffness: 300, damping: 28, mass: 0.2 });

  // Smooth offset on Y axis
  const yOffset = useTransform(y, (val) => val + 12);

  useEffect(() => {
    x.set(pos.x || 0);
    y.set(pos.y || 0);
  }, [pos.x, pos.y, x, y]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden="true" // purely visual cursor; hidden from screen readers
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x,
        y: yOffset,
        pointerEvents: "none",
        zIndex: 9999,
        fontFamily: "Trivia Serif",
        fontWeight: 400,
        fontSize: 24,
        color: "var(--foreground)",
        userSelect: "none",
        willChange: "transform",
      }}
    >
      {text}
    </motion.div>
  );
}