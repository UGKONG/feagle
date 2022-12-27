import _React from "react";
import { CChart } from "@coreui/react-chartjs";

type Props = {
  data?: Array<{ name: string; value: number }>;
  label?: string;
};
export default function BarChart({ data = [], label = "통계" }: Props) {
  return (
    <CChart
      type="bar"
      data={{
        labels: data?.map((x) => x?.name),
        datasets: [
          {
            label,
            backgroundColor: "#f8797970",
            data: data?.map((x) => x?.value),
            borderColor: "#f87979",
            borderWidth: 1,
          },
        ],
      }}
      options={{ responsive: true }}
    />
  );
}
