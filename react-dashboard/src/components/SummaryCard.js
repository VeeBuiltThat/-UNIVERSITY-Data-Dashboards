import React from 'react';

const SummaryCard = ({ title, value, subtitle, color }) => (
  <div className="summary-card" style={{ borderLeftColor: color }}>
    <div className="card-value" style={{ color }}>{value}</div>
    <div className="card-title">{title}</div>
    {subtitle && <div className="card-subtitle">{subtitle}</div>}
  </div>
);

export default SummaryCard;
