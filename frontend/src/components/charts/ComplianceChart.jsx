import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const ComplianceChart = ({ trendData = [] }) => {
  return (
    <div className="h-72 w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSoc2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDpdp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              borderColor: '#475569',
              borderRadius: '8px',
              color: '#F8FAFC',
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Area
            type="monotone"
            name="SOC 2 Type II"
            dataKey="soc2"
            stroke="#4f46e5"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSoc2)"
          />
          <Area
            type="monotone"
            name="DPDP Act"
            dataKey="dpdp"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorDpdp)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComplianceChart;
