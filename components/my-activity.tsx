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
import { useMyActivity } from "@/hooks/use-my-activity";
import { iconsKV } from "@/data/icons";
import { MyActivitySkeleton } from "./my-activity-skeleton";

interface Props {
  userId: string;
}

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
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.activity.name}
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
          <p className="text-base">{value} hours</p>
        </div>
        <div className="text-left">
          <p className="text-sm text-zinc-600">{name}</p>
        </div>
      </div>
    );
  }

  return null;
};

export const MyActivity = ({ userId }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data, error, isLoading, isRefetching } = useMyActivity({ userId });

  if (!data || isLoading || isRefetching) {
    return <MyActivitySkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My activity</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {data && (
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
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} className="fill-secondary" />
                ))}
              </Pie>
              <Tooltip content={<CTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
