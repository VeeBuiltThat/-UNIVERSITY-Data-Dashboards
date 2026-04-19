import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
} from 'recharts';
import { mtcarsData } from '../data/mtcars';
import SummaryCard from './SummaryCard';
import DataTable from './DataTable';

const CYL_COLORS  = { 4: '#2ecc71', 6: '#3498db', 8: '#e74c3c' };
const ALL_CYL     = [4, 6, 8];

const AXIS_OPTIONS = [
  { value: 'hp',   label: 'Horsepower'      },
  { value: 'mpg',  label: 'MPG'             },
  { value: 'wt',   label: 'Weight (1000 lb)'},
  { value: 'disp', label: 'Displacement'    },
  { value: 'drat', label: 'Rear Axle Ratio' },
  { value: 'qsec', label: '¼ Mile Time (s)' },
];

const avg     = (arr, key) => arr.length ? +(arr.reduce((s, d) => s + d[key], 0) / arr.length).toFixed(1) : 0;
const avgInt  = (arr, key) => arr.length ? Math.round(arr.reduce((s, d) => s + d[key], 0) / arr.length) : 0;

const CarTooltip = ({ active, payload, xLabel, yLabel }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <strong>{d.car}</strong>
      <span>{xLabel}: {d.x}</span>
      <span>{yLabel}: {d.y}</span>
    </div>
  );
};

const MtcarsDashboard = () => {
  const [xAxis, setXAxis]       = useState('hp');
  const [yAxis, setYAxis]       = useState('mpg');
  const [selectedCyl, setSelCyl] = useState([...ALL_CYL]);

  const toggle = c =>
    setSelCyl(prev => prev.includes(c) ? prev.filter(v => v !== c) : [...prev, c]);

  const filtered = useMemo(
    () => mtcarsData.filter(d => selectedCyl.includes(d.cyl)),
    [selectedCyl]
  );

  const scatterSeries = useMemo(
    () => ALL_CYL
      .filter(c => selectedCyl.includes(c))
      .map(c => ({
        name:  `${c} cyl`,
        color: CYL_COLORS[c],
        data:  filtered
          .filter(d => d.cyl === c)
          .map(d => ({ x: d[xAxis], y: d[yAxis], car: d.car })),
      })),
    [filtered, xAxis, yAxis, selectedCyl]
  );

  const barData = useMemo(
    () => ALL_CYL
      .filter(c => selectedCyl.includes(c))
      .map(c => {
        const rows = mtcarsData.filter(d => d.cyl === c);
        return {
          cylinders: `${c} cyl`,
          'Avg MPG': avg(rows, 'mpg'),
          'Avg HP':  avgInt(rows, 'hp'),
        };
      }),
    [selectedCyl]
  );

  const xLabel = AXIS_OPTIONS.find(o => o.value === xAxis)?.label ?? xAxis;
  const yLabel = AXIS_OPTIONS.find(o => o.value === yAxis)?.label ?? yAxis;

  const avgMpg = filtered.length ? avg(filtered, 'mpg')   : '—';
  const avgHp  = filtered.length ? avgInt(filtered, 'hp') : '—';

  const TABLE_COLS = [
    { key: 'car',  label: 'Car'   },
    { key: 'mpg',  label: 'MPG'   },
    { key: 'cyl',  label: 'Cyl'   },
    { key: 'hp',   label: 'HP'    },
    { key: 'wt',   label: 'Wt'    },
    { key: 'disp', label: 'Disp'  },
    { key: 'gear', label: 'Gear'  },
    { key: 'carb', label: 'Carb'  },
  ];

  return (
    <div className="dashboard">
      {/* ── Summary cards ── */}
      <div className="summary-cards">
        <SummaryCard title="Total Cars"       value={filtered.length}            color="#3498db" />
        <SummaryCard title="Avg MPG"          value={avgMpg} subtitle="miles/gal" color="#2ecc71" />
        <SummaryCard title="Avg Horsepower"   value={avgHp}  subtitle="hp"        color="#e74c3c" />
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
            <label>Cylinders</label>
            {ALL_CYL.map(c => (
              <div key={c} className="checkbox-item">
                <input
                  type="checkbox" id={`cyl-${c}`}
                  checked={selectedCyl.includes(c)}
                  onChange={() => toggle(c)}
                />
                <label htmlFor={`cyl-${c}`} style={{ color: CYL_COLORS[c] }}>{c} cylinders</label>
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
              <Tooltip content={<CarTooltip xLabel={xLabel} yLabel={yLabel} />} cursor={{ strokeDasharray: '3 3' }} />
              <Legend verticalAlign="top" />
              {scatterSeries.map(s => (
                <Scatter key={s.name} name={s.name} data={s.data} fill={s.color} opacity={0.85} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bar chart ── */}
      <div className="chart-panel">
        <h3>Average MPG &amp; Horsepower by Cylinders</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 10, right: 30, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cylinders" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Avg MPG" fill="#3498db" radius={[3,3,0,0]} />
            <Bar dataKey="Avg HP"  fill="#e74c3c" radius={[3,3,0,0]} />
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

export default MtcarsDashboard;
