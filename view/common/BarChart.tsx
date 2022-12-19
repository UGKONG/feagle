import _React from "react";
import { CChart } from "@coreui/react-chartjs";

type Props = {
  data?: Array<{ name: string; value: number }>;
};
export default function BarChart({ data = [] }: Props) {
  return (
    <CChart
      type="bar"
      data={{
        labels: data?.map((x) => x?.name),
        datasets: [
          {
            label: "통계",
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
