"use client";

import { iconsKV } from "@/data/icons";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";

interface Props {
  data: any[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={0} textAnchor="middle" fill={fill}>
        {payload.activity.name}
      </text>
      {payload.counterTime && (
        <text x={cx} y={cy} dy={16} textAnchor="middle" fill={fill}>
          {payload.counterTime.hours +
            "h" +
            ":" +
            payload.counterTime.minutes +
            "m"}
        </text>
      )}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const CTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    const IconComp = iconsKV[data.activity.icon];
    const value = Math.round(data.counter * 100) / 100;
    const name = data.activity.name;
    return (
      <div className="w-36 bg-white ring-1 ring-primary p-2 h-fit rounded-md flex flex-col justify-center">
        <div className="w-full flex items-center">
          {IconComp && <IconComp className="w-4 h-4 mr-2" />}
          {data.counterTime && (
            <p className="text-base">
              {data.counterTime.hours +
                "h" +
                ":" +
                data.counterTime.minutes +
                "m"}
            </p>
          )}
        </div>
        <div className="text-left">
          <p className="text-sm text-zinc-600">{name}</p>
        </div>
      </div>
    );
  }

  return null;
};

export function ActivityChart({
  data,
  selectedIndex,
  setSelectedIndex,
}: Props) {
  return (
    <ResponsiveContainer
      width="100%"
      className="[&_*]:outline-none"
      height={200}
    >
      <PieChart>
        <Pie
          data={data}
          innerRadius={60}
          outerRadius={80}
          fill="#0f172a"
          paddingAngle={5}
          dataKey="counter"
          activeIndex={selectedIndex}
          activeShape={renderActiveShape}
          onMouseEnter={(_, index) => setSelectedIndex(index)}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} className="fill-secondary" />
          ))}
        </Pie>
        <Tooltip content={<CTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
