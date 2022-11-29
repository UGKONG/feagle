import _React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Store } from "../../functions/store";
import { Alert as CustomAlert } from "@mui/material";
import { AlertData, OrNull } from "../../types";

const currentBottom = -50;
const currentData: AlertData = { type: "info", text: "" };

export default function Alert() {
  const dispatch = useDispatch();
  const alertData: OrNull<AlertData> = useSelector((x: Store) => x?.alert);
  const [data, setData] = useState<OrNull<AlertData>>(currentData);
  const [bottom, setBottom] = useState(currentBottom);

  const onClick = () => {
    dispatch({ type: "alert", payload: null });
  };

  const dataChange = () => {
    setBottom(alertData ? 40 : currentBottom);

    if (alertData) {
      setData(alertData);
      setTimeout(() => dispatch({ type: "alert", payload: null }), 3000);
    }
  };

  useEffect(dataChange, [alertData]);

  if (!data) return null;
  return (
    <CustomAlert
      onClick={onClick}
      severity={data?.type}
      style={{
        bottom,
        right: 40,
        position: "fixed",
        boxShadow: "0 2px 4px #00000060",
        minWidth: 250,
        transition: "0.3s",
        cursor: "pointer",
        paddingRight: 25,
      }}
    >
      {data?.text}
    </CustomAlert>
  );
}
