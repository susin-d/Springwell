
import React from 'react';
import { Card } from '../../../components/ui/Card';
import { BarChart3, LineChart as LineChartIcon, BarChart as BarChartIcon, Bot } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface ChartConfig {
    id: string;
    type: 'bar' | 'line';
    location: string;
    title: string;
}

interface DataChartsProps {
    charts: ChartConfig[];
}

// Mock data generator
const generateChartData = (location: string, type: 'bar' | 'line') => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Use a hash of the location to create semi-consistent random data
    const seed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return months.map((month, i) => {
        const randomFactor = (Math.sin(seed + i) + 1) / 2;
        return {
            name: month,
            value: type === 'bar' ? Math.floor(randomFactor * 200 + 50) : Number((-1 - randomFactor * 2.5).toFixed(1)),
        };
    });
};


export const DataCharts: React.FC<DataChartsProps> = ({ charts }) => {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Data Analytics Dashboard</h2>
            <p className="text-white/70">Ask the AI Assistant to generate charts for specific locations and datasets.</p>
        </div>

        {charts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-3/4 text-center">
                <Bot className="w-16 h-16 text-white/30 mb-4" />
                <h3 className="text-xl font-semibold text-white">This canvas is ready for your insights.</h3>
                <p className="text-white/60 max-w-sm">
                    Try asking the AI assistant something like: <br />
                    <span className="italic text-emerald-400">"Create a bar chart for rainfall in Maharashtra"</span>
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {charts.map(chart => {
                    const data = generateChartData(chart.location, chart.type);
                    const isBar = chart.type === 'bar';
                    const Icon = isBar ? BarChartIcon : LineChartIcon;

                    return (
                        <Card key={chart.id} className="p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <Icon className={`w-5 h-5 ${isBar ? 'text-blue-400' : 'text-emerald-400'}`} />
                                <h3 className="text-lg font-semibold text-white">{chart.title}</h3>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    {isBar ? (
                                        <BarChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                            <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} />
                                            <YAxis unit="mm" tick={{ fill: '#a0aec0' }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                                            <Legend wrapperStyle={{ color: '#a0aec0' }} />
                                            <Bar dataKey="value" name="Rainfall (mm)" fill="#3b82f6" />
                                        </BarChart>
                                    ) : (
                                        <LineChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                            <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} />
                                            <YAxis unit="m" tick={{ fill: '#a0aec0' }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                                            <Legend wrapperStyle={{ color: '#a0aec0' }} />
                                            <Line type="monotone" dataKey="value" name="Water Level (m)" stroke="#34d399" strokeWidth={2} />
                                        </LineChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    );
                })}
            </div>
        )}
    </div>
  );
};
