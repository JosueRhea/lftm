import { DayRecordStat } from "@lftm/api/src/types";
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
  data: DayRecordStat[];
}

const CTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    const hours = Math.floor(data.tracked_ms / (1000 * 60 * 60));
    const minutes = Math.floor(
      (data.tracked_ms % (1000 * 60 * 60)) / (1000 * 60)
    );

    return (
      <div className="w-36 bg-background text-foreground ring-1 ring-muted p-2 h-fit rounded-sm flex flex-col justify-center">
        <div className="w-full flex flex-col items-center">
          <p className="text-sm">{format(new Date(data.day), "MMM dd yyyy")}</p>
          <p className="text-base">{hours + "h" + ":" + minutes + "m"}</p>
        </div>
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
          dataKey="day"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            const date = new Date(value);
            const dateFormated = format(date, "MMM dd");
            return dateFormated;
          }}
        />
        <YAxis
          tickFormatter={(value) => {
            const hours = Math.floor(value / (1000 * 60 * 60));
            const minutes = Math.floor(
              (value % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((value % (1000 * 60)) / 1000);

            if (hours > 0) {
              return hours + " h";
            }

            if (minutes > 0) {
              return minutes + " m";
            }

            if (seconds > 0) {
              return seconds + " s";
            }

            return value + " ms";
          }}
          fontSize={12}
          width={40}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CTooltip />} cursor={{ fill: tooltipBackground }} />
        <Bar
          dataKey="tracked_ms"
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
