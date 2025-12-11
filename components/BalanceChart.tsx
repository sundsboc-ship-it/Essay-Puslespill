import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AnalysisResult } from '../types';

interface BalanceChartProps {
  analysis: AnalysisResult | null;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-sm">Skriv og analyser for å se balansen</p>
      </div>
    );
  }

  const data = [
    { name: 'Påstand (Rød)', value: analysis.balanceScore.claim, color: '#ef4444' }, // Red-500
    { name: 'Bevis (Blå)', value: analysis.balanceScore.evidence, color: '#3b82f6' }, // Blue-500
    { name: 'Drøfting (Grønn)', value: analysis.balanceScore.reflection, color: '#10b981' }, // Emerald-500
  ].filter(d => d.value > 0);

  // If empty (e.g. only neutral sentences), show a placeholder
  if (data.length === 0) {
      data.push({ name: 'Nøytral', value: 100, color: '#94a3b8' });
  }

  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Tekstbalanse</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
            />
            <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs text-gray-500 italic border-t pt-2">
        "{analysis.feedback}"
      </div>
    </div>
  );
};

export default BalanceChart;