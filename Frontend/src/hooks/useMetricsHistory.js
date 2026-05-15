import { useState } from "react";

export default function useMetricsHistory(limit = 20) {
  const [history, setHistory] = useState([]);

  const addPoint = (newData) => {
    setHistory((prev) => {
      const updated = [...prev, newData];

      if (updated.length > limit) {
        updated.shift(); // remove oldest point
      }

      return updated;
    });
  };

  return { history, addPoint };
}