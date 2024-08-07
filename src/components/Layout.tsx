// components/Layout.tsx
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex bg-sky-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default Layout;

// components/Sidebar.tsx
import React from 'react';
import { FaUser, FaHome, FaEnvelope, FaStar, FaCog } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <div className="w-16 bg-white h-screen flex flex-col items-center py-8 space-y-8">
      <FaUser className="text-sky-500 text-2xl" />
      <FaHome className="text-gray-400 text-2xl" />
      <FaEnvelope className="text-gray-400 text-2xl" />
      <FaStar className="text-gray-400 text-2xl" />
      <FaCog className="text-gray-400 text-2xl" />
    </div>
  );
};

export default Sidebar;

// components/LineChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface LineChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
  title: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, options, title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;

// components/BarChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface BarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, options, title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;

// components/DoughnutChart.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface DoughnutChartProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
  title: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, options, title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;

// components/KPICard.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface KPICardProps {
  title: string;
  value: number;
  chartData: ChartData<'line'>;
  chartOptions: ChartOptions<'line'>;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, chartData, chartOptions }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
      <div>
        <h3 className="text-3xl font-bold">{value}</h3>
        <p className="text-gray-500">{title}</p>
      </div>
      <Line data={chartData} options={chartOptions} className="w-24" />
    </div>
  );
};

export default KPICard;

// components/CalendarComponent.tsx
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarComponent: React.FC = () => {
  const events = [
    {
      title: 'Event 1',
      start: new Date(2024, 0, 15),
      end: new Date(2024, 0, 15),
    },
    // Add more events as needed
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400 }}
      />
    </div>
  );
};

export default CalendarComponent;

// components/SearchBar.tsx
import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <input
      type="text"
      placeholder="Search..."
      className="w-full p-2 border rounded-full mb-4"
    />
  );
};

export default SearchBar;