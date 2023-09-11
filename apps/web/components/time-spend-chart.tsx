import { TimeSpendProps } from "@/types/db";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: TimeSpendProps[];
}

const CTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    // const IconComp = iconsKV[data.activity.icon];
    // const value = Math.round(data.counter * 100) / 100;
    // const name = data.activity.name;

    return (
      <div className="w-36 bg-background text-foreground ring-1 ring-muted p-2 h-fit rounded-sm flex flex-col justify-center">
        {data.counterTime && (
          <div className="w-full flex flex-col items-center">
            <p className="text-sm">{format(new Date(data.dayStart), "MM eeee yyyy")}</p>
            <p className="text-base">
              {data.counterTime.hours +
                "h" +
                ":" +
                data.counterTime.minutes +
                "m"}
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export const TimeSpendChart = ({ data }: Props) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const { theme } = useTheme();

  const tooltipBackground = theme == "dark" ? "#1f2937" : "#f3f4f6";
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis
          dataKey="dayStart"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            const date = new Date(value);
            const dateFormated = format(date, "MM eee")
            // const formatedDate = date.toLocaleDateString("en-US", {
            //   day: "2-digit",
            //   month: "2-digit",
            //   year: "2-digit",
            // });
            // return formatedDate;
            return dateFormated
          }}
        />
        <YAxis fontSize={12} width={40} tickLine={false} axisLine={false} />
        <Tooltip content={<CTooltip />} cursor={{ fill: tooltipBackground }} />
        <Bar
          dataKey="counter"
          radius={[4, 4, 0, 0]}
          onMouseEnter={(_, index) => setActiveIndex(index)}
        >
          {data.map((_, index) => (
            <Cell
              cursor="pointer"
              // fill={index === activeIndex ? "#bef264" : "#adfa1d"}
              className="fill-primary"
              key={`cell-${index}`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
