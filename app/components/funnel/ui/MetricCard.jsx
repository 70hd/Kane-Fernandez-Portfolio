// components/funnel/ui/MetricCard.jsx
import React from "react";

export default function MetricCard({ value, title, text }) {
  return (
    <div className="w-36 md:w-[200px]">
      {value ? <h2 className="h2">{value}</h2> : <p className="strong-inter">{title}</p>}
      <p className="mt-2">{text}</p>
    </div>
  );
}