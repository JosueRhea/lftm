"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

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
      <text x={cx} y={cy} dy={0} textAnchor="middle" className="fill-primary">
        {payload.activity.name}
      </text>
      {payload.counterTime && (
        <text
          x={cx}
          y={cy}
          dy={16}
          textAnchor="middle"
          className="fill-primary"
        >
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
        className="fill-primary"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        className="fill-primary"
      />
    </g>
  );
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
            <Cell key={`cell-${index}`} className="fill-secondary stroke-none" />
          ))}
        </Pie>
        {/* <Tooltip content={<CTooltip />} /> */}
      </PieChart>
    </ResponsiveContainer>
  );
}
