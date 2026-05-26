import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type ChartDataItem = {
  date: string;
  value: number;
};

type DotPos = {
  left: number;
  top: number;
};

type BasicLineChartProps = {
  data?: ChartDataItem[];
};

const BasicLineChart = ({ data = [] }: BasicLineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<{ x: number; y: number } | null>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dotPos, setDotPos] = useState<DotPos | null>(null);

  const currentIndex = activeIndex ?? data.length - 1;
  const currentItem = data[currentIndex];
  const yAxisDomain = useMemo(() => {
    if (data.length === 0) return [90, 130];

    const values = data.map((item) => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = Math.max((max - min) * 0.2, 5);

    return [
      Math.floor((min - padding) / 5) * 5,
      Math.ceil((max + padding) / 5) * 5,
    ];
  }, [data]);

  const tooltipNode = useMemo(() => {
    if (!dotPos || activeIndex === null || !currentItem) {
      return null;
    }

    const bubbleHeight = 28;
    const tailHeight = 6;
    const gap = 6;
    const OFFSET_X = 40;

    const left = dotPos.left - OFFSET_X;
    const top = dotPos.top - bubbleHeight - tailHeight - gap;

    return (
      <div
        style={{
          position: "fixed",
          left,
          top,
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#3385FF",
            color: "#fff",
            padding: "4px 9px",
            borderRadius: "4px",
            fontSize: "13px",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {`${currentItem.date} 평균 ${currentItem.value}점`}
        </div>

        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid #3385FF",
            marginTop: "-1px",
            marginLeft: "80px",
          }}
        />
      </div>
    );
  }, [activeIndex, currentItem, dotPos]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full text-sm text-coolNeutral-50">
        표시할 추이 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        minHeight={0}
        initialDimension={{ width: 1, height: 1 }}
      >
        <LineChart
          data={data}
          onMouseMove={(state) => {
            const rawIndex = state?.activeTooltipIndex;
            const hasIndex =
              rawIndex !== undefined && rawIndex !== null && rawIndex !== "";

            if (state?.isTooltipActive && hasIndex) {
              const nextIndex = Number(rawIndex);

              if (Number.isNaN(nextIndex)) {
                setActiveIndex(null);
                setDotPos(null);
                return;
              }

              setActiveIndex(nextIndex);

              if (dotRef.current && chartRef.current) {
                const rect = chartRef.current.getBoundingClientRect();

                setDotPos({
                  left: rect.left + dotRef.current.x,
                  top: rect.top + dotRef.current.y,
                });
              }
            } else {
              setActiveIndex(null);
              setDotPos(null);
            }
          }}
          onMouseLeave={() => {
            setActiveIndex(null);
            setDotPos(null);
          }}
        >
          <CartesianGrid stroke="#F2F4F5" vertical={false} />

          {activeIndex !== null && (
            <ReferenceLine x={data[activeIndex].date} stroke="#C2C4C8" />
          )}

          <XAxis
            dataKey="date"
            interval="preserveEnd"
            tick={{
              fontSize: 9,
              fontWeight: 400,
              fill: "#46474C",
            }}
            axisLine={{ stroke: "#C2C4C8", strokeWidth: 2 }}
            tickLine={{ stroke: "#C2C4C8", strokeWidth: 2 }}
            tickMargin={6}
          />

          <YAxis
            domain={yAxisDomain}
            tick={{
              fontSize: 9,
              fontWeight: 400,
              fill: "#46474C",
            }}
            axisLine={false}
            tickLine={{ stroke: "#C2C4C8", strokeWidth: 0 }}
            width={30}
          />

          <Tooltip
            cursor={false}
            content={() => null}
            wrapperStyle={{ display: "none" }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#3385FF"
            strokeWidth={3}
            dot={false}
            activeDot={(props) => {
              if (props.cx == null || props.cy == null) return null;

              dotRef.current = {
                x: props.cx,
                y: props.cy,
              };

              return (
                <g>
                  <defs>
                    <filter
                      id="dotShadow"
                      x="-100%"
                      y="-100%"
                      width="300%"
                      height="300%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="2"
                        floodColor="#69A5FF"
                        floodOpacity="0.5"
                      />
                    </filter>
                  </defs>

                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill="#3385FF"
                    filter="url(#dotShadow)"
                  />
                </g>
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {tooltipNode && createPortal(tooltipNode, document.body)}
    </div>
  );
};

export default BasicLineChart;
