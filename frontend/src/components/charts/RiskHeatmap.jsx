import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';

const RiskHeatmap = ({ data = [] }) => {
  // Translate risks into coordinate grid (Likelihood vs Impact)
  // Grid coordinates: x is Impact (1 to 4), y is Likelihood (1 to 4)
  const matrixData = [
    { x: 1, y: 1, z: 0, name: 'Low (1,1)' },
    { x: 2, y: 1, z: 0, name: 'Low/Med (2,1)' },
    { x: 3, y: 1, z: 0, name: 'Med (3,1)' },
    { x: 4, y: 1, z: 0, name: 'Med/High (4,1)' },
    { x: 1, y: 2, z: 0, name: 'Low/Med (1,2)' },
    { x: 2, y: 2, z: 0, name: 'Med (2,2)' },
    { x: 3, y: 2, z: 0, name: 'Med/High (3,2)' },
    { x: 4, y: 2, z: 0, name: 'High (4,2)' },
    { x: 1, y: 3, z: 0, name: 'Med (1,3)' },
    { x: 2, y: 3, z: 0, name: 'Med/High (2,3)' },
    { x: 3, y: 3, z: 0, name: 'High (3,3)' },
    { x: 4, y: 3, z: 0, name: 'Critical (4,3)' },
    { x: 1, y: 4, z: 0, name: 'Med/High (1,4)' },
    { x: 2, y: 4, z: 0, name: 'High (2,4)' },
    { x: 3, y: 4, z: 0, name: 'Critical (3,4)' },
    { x: 4, y: 4, z: 0, name: 'Critical (4,4)' },
  ];

  // Map risks onto grid coordinates
  data.forEach((r) => {
    const likelihood = r.likelihood || 1;
    const impact = r.impact || 1;
    const cell = matrixData.find((item) => item.x === impact && item.y === likelihood);
    if (cell) cell.z += 1;
  });

  const getCellColor = (x, y, z) => {
    if (z === 0) return 'rgba(241, 245, 249, 0.05)';
    const score = x * y;
    if (score <= 2) return 'rgba(16, 185, 129, 0.8)'; // Green
    if (score <= 6) return 'rgba(245, 158, 11, 0.8)'; // Yellow
    if (score <= 12) return 'rgba(239, 68, 68, 0.8)'; // Red
    return 'rgba(220, 38, 38, 0.95)'; // Dark Red (Critical)
  };

  return (
    <div className="h-72 w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis
            type="number"
            dataKey="x"
            name="Impact"
            domain={[0.5, 4.5]}
            tickCount={5}
            tickFormatter={(v) => (v >= 1 && v <= 4 ? ['Low', 'Med', 'High', 'Crit'][v - 1] : '')}
            stroke="#94a3b8"
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Likelihood"
            domain={[0.5, 4.5]}
            tickCount={5}
            tickFormatter={(v) => (v >= 1 && v <= 4 ? ['Low', 'Med', 'High', 'Crit'][v - 1] : '')}
            stroke="#94a3b8"
          />
          <ZAxis type="number" dataKey="z" range={[40, 400]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const dataInfo = payload[0].payload;
                return (
                  <div className="bg-slate-800 border border-slate-700 p-2.5 rounded-lg shadow-xl text-slate-100">
                    <p className="font-semibold text-xs">{dataInfo.name}</p>
                    <p className="mt-1">Risks: <span className="font-bold text-indigo-400">{dataInfo.z}</span></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter data={matrixData}>
            {matrixData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getCellColor(entry.x, entry.y, entry.z)}
                stroke="#475569"
                strokeWidth={entry.z > 0 ? 1.5 : 0.5}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskHeatmap;
