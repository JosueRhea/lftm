"use client";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import { useState } from "react";

interface Props {
  userId: string;
}

const data = [
  { name: "Group A", value: 400, icon: Mail },
  { name: "Group B", value: 300, icon: Mail },
  { name: "Group C", value: 300, icon: Mail },
  { name: "Group D", value: 200, icon: Mail },
  { name: "Group E", value: 500, icon: Mail },
];

const RADIAN = Math.PI / 180;
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
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

export const MyActivity = ({ userId }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // const client = createClientComponentClient();
  // useEffect(() => {
  //   (async () => {
  //     const { data } = await get24hRecords(client, { userId });
  //     console.log(data);
  //   })();
  // }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>My activity</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
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
              dataKey="value"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} className="fill-secondary" />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
