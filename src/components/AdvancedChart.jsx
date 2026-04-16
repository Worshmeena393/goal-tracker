import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from 'recharts';
import { useTheme, alpha } from '@mui/material';

const AdvancedChart = ({ 
  type = 'bar', 
  data, 
  colors, 
  height = 300, 
  showGrid = true,
  showLegend = true,
  animated = true,
  gradient = true,
  ...props 
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Generate gradient definitions for charts
  const renderGradients = () => {
    if (!gradient) return null;
    
    return (
      <defs>
        {colors.map((color, index) => (
          <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={color} stopOpacity={0.3}/>
          </linearGradient>
        ))}
        {colors.map((color, index) => (
          <radialGradient key={`radial-${index}`} id={`radial-${index}`}>
            <stop offset="0%" stopColor={color} stopOpacity={1}/>
            <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
          </radialGradient>
        ))}
      </defs>
    );
  };

  // Custom tooltip with enhanced styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="animate-fade-scale"
        >
          <div
            style={{
              backgroundColor: theme.palette.background.paper,
              border: 'none',
              borderRadius: 12,
              padding: '12px 16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              color: theme.palette.text.primary,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            <p style={{ margin: 0, fontWeight: 900, marginBottom: 8 }}>
              {label}
            </p>
            {payload.map((entry, index) => (
              <p key={index} style={{ 
                margin: '4px 0', 
                color: entry.color || colors[index % colors.length],
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <span 
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: entry.color || colors[index % colors.length],
                  }}
                />
                {entry.name}: {entry.value}
              </p>
            ))}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Chart renderers
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const axisProps = {
      axisLine: false,
      tickLine: false,
      tick: { fill: theme.palette.text.secondary, fontWeight: 700, fontSize: 12 }
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps} {...props}>
            {renderGradients()}
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />}
            <XAxis 
              dataKey="name" 
              {...axisProps} 
              interval={0}
              tick={(props) => {
                const { x, y, payload } = props;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text 
                      x={0} 
                      y={0} 
                      dy={16} 
                      textAnchor="middle" 
                      fill={theme.palette.text.secondary} 
                      style={{ fontWeight: 700, fontSize: 11 }}
                    >
                      {payload.value.length > 10 ? `${payload.value.substring(0, 10)}...` : payload.value}
                    </text>
                  </g>
                );
              }}
            />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {data[0] && Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                fill={gradient ? `url(#gradient-${index})` : colors[index % colors.length]}
                radius={[8, 8, 0, 0]}
                animationDuration={animated ? 1200 : 0}
                animationBegin={index * 100}
              >
                {/* If there's only one dataKey, we can color individual cells */}
                {Object.keys(data[0]).filter(k => k !== 'name').length === 1 && 
                  data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                  ))
                }
              </Bar>
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps} {...props}>
            {renderGradients()}
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />}
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {data[0] && Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
              <Line 
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
                animationDuration={animated ? 1500 : 0}
                animationBegin={index * 150}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps} {...props}>
            {renderGradients()}
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />}
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
            {data[0] && Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
              <Area 
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={gradient ? `url(#gradient-${index})` : colors[index % colors.length]}
                strokeWidth={2}
                animationDuration={animated ? 1500 : 0}
                animationBegin={index * 150}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            {renderGradients()}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              animationDuration={animated ? 1200 : 0}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={gradient ? `url(#radial-${index})` : colors[index % colors.length]} 
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
          </PieChart>
        );

      case 'radar':
        return (
          <RadarChart data={data} {...props}>
            {renderGradients()}
            <PolarGrid stroke={alpha(theme.palette.divider, 0.3)} />
            <PolarAngleAxis dataKey="subject" {...axisProps} />
            <PolarRadiusAxis {...axisProps} />
            <Radar
              name="Progress"
              dataKey="value"
              stroke={colors[0]}
              fill={gradient ? `url(#gradient-0)` : colors[0]}
              fillOpacity={0.6}
              animationDuration={animated ? 1500 : 0}
            />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend />}
          </RadarChart>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AdvancedChart;
