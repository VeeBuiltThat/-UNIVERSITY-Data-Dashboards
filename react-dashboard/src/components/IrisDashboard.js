import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
} from 'recharts';
import { irisData } from '../data/iris';
import SummaryCard from './SummaryCard';
import DataTable from './DataTable';

const SPECIES_COLORS = { setosa: '#e74c3c', versicolor: '#2ecc71', virginica: '#3498db' };
const ALL_SPECIES    = ['setosa', 'versicolor', 'virginica'];

const AXIS_OPTIONS = [
  { value: 'sepalLength', label: 'Sepal Length (cm)' },
  { value: 'sepalWidth',  label: 'Sepal Width (cm)'  },
  { value: 'petalLength', label: 'Petal Length (cm)' },
  { value: 'petalWidth',  label: 'Petal Width (cm)'  },
];

const avg = (arr, key) =>
  arr.length ? +(arr.reduce((s, d) => s + d[key], 0) / arr.length).toFixed(2) : 0;

const ScatterTooltip = ({ active, payload, xLabel, yLabel }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <strong>{d.species}</strong>
      <span>{xLabel}: {d.x}</span>
      <span>{yLabel}: {d.y}</span>
    </div>
  );
};

const IrisDashboard = () => {
  const [xAxis, setXAxis]             = useState('sepalLength');
  const [yAxis, setYAxis]             = useState('petalLength');
  const [selectedSpecies, setSelected] = useState([...ALL_SPECIES]);

  const toggle = sp =>
    setSelected(prev => prev.includes(sp) ? prev.filter(s => s !== sp) : [...prev, sp]);

  const filtered = useMemo(
    () => irisData.filter(d => selectedSpecies.includes(d.species)),
    [selectedSpecies]
  );

  const scatterSeries = useMemo(
    () => ALL_SPECIES
      .filter(sp => selectedSpecies.includes(sp))
      .map(sp => ({
        name:  sp,
        color: SPECIES_COLORS[sp],
        data:  filtered
          .filter(d => d.species === sp)
          .map(d => ({ x: d[xAxis], y: d[yAxis], species: sp })),
      })),
    [filtered, xAxis, yAxis, selectedSpecies]
  );

  const barData = useMemo(
    () => ALL_SPECIES
      .filter(sp => selectedSpecies.includes(sp))
      .map(sp => {
        const rows = irisData.filter(d => d.species === sp);
        return {
          species:      sp,
          'Sepal L':    avg(rows, 'sepalLength'),
          'Sepal W':    avg(rows, 'sepalWidth'),
          'Petal L':    avg(rows, 'petalLength'),
          'Petal W':    avg(rows, 'petalWidth'),
        };
      }),
    [selectedSpecies]
  );

  const xLabel = AXIS_OPTIONS.find(o => o.value === xAxis)?.label ?? xAxis;
  const yLabel = AXIS_OPTIONS.find(o => o.value === yAxis)?.label ?? yAxis;

  const avgSepalLength = filtered.length ? avg(filtered, 'sepalLength') : '—';

  const TABLE_COLS = [
    { key: 'id',          label: '#'          },
    { key: 'sepalLength', label: 'Sepal L'    },
    { key: 'sepalWidth',  label: 'Sepal W'    },
    { key: 'petalLength', label: 'Petal L'    },
    { key: 'petalWidth',  label: 'Petal W'    },
    { key: 'species',     label: 'Species'    },
  ];

  return (
    <div className="dashboard">
      {/* ── Summary cards ── */}
      <div className="summary-cards">
        <SummaryCard title="Observations"      value={filtered.length}              color="#3498db" />
        <SummaryCard title="Species Selected"  value={selectedSpecies.length}       color="#2ecc71" />
        <SummaryCard title="Avg Sepal Length"  value={avgSepalLength} subtitle="cm" color="#e74c3c" />
      </div>

      {/* ── Controls + Scatter ── */}
      <div className="dashboard-grid">
        <div className="controls-panel">
          <h3>Controls</h3>
          <div className="control-group">
            <label>X Axis</label>
            <select value={xAxis} onChange={e => setXAxis(e.target.value)}>
              {AXIS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Y Axis</label>
            <select value={yAxis} onChange={e => setYAxis(e.target.value)}>
              {AXIS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label>Species</label>
            {ALL_SPECIES.map(sp => (
              <div key={sp} className="checkbox-item">
                <input
                  type="checkbox" id={`iris-${sp}`}
                  checked={selectedSpecies.includes(sp)}
                  onChange={() => toggle(sp)}
                />
                <label htmlFor={`iris-${sp}`} style={{ color: SPECIES_COLORS[sp] }}>{sp}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-panel">
          <h3>Scatter: {xLabel} vs {yLabel}</h3>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name={xLabel}
                label={{ value: xLabel, position: 'insideBottom', offset: -15, fontSize: 12 }} />
              <YAxis type="number" dataKey="y" name={yLabel}
                label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize: 12 }} />
              <Tooltip content={<ScatterTooltip xLabel={xLabel} yLabel={yLabel} />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend verticalAlign="top" />
              {scatterSeries.map(s => (
                <Scatter key={s.name} name={s.name} data={s.data} fill={s.color} opacity={0.8} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bar chart ── */}
      <div className="chart-panel">
        <h3>Average Measurements by Species</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 10, right: 30, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="species" />
            <YAxis unit=" cm" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Sepal L" fill="#3498db" radius={[3,3,0,0]} />
            <Bar dataKey="Sepal W" fill="#2ecc71" radius={[3,3,0,0]} />
            <Bar dataKey="Petal L" fill="#e74c3c" radius={[3,3,0,0]} />
            <Bar dataKey="Petal W" fill="#f39c12" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Data table ── */}
      <div className="table-panel">
        <h3>Data Table ({filtered.length} rows)</h3>
        <DataTable data={filtered} columns={TABLE_COLS} />
      </div>
    </div>
  );
};

export default IrisDashboard;
