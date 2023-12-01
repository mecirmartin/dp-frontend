import { useDispatch, useSelector } from "react-redux";
import { setAppliances, setUptime } from "../features/appliancesSlice";
import { useEffect } from "react";
import useToken from "./useToken";

const getDatesMidnightTimeStamp = (date: Date, offset = 0) => {
  date.setHours(offset * 24, 0, 0, 0);
  return date.getTime();
};

export const useApplicationData = () => {
  const appliances = useSelector(state => (state as any).appliances.appliances);
  const uptime = useSelector(state => (state as any).appliances.uptime);
  const { token } = useToken();
  const dispatch = useDispatch();

  const fetchData = async () => {
    if (!appliances || appliances.length === 0 || !uptime || uptime.length === 0) {
      const response = await fetch(import.meta.env.VITE_GET_APPLIANCES_FUNCTION_URL, {
        body: JSON.stringify({ token }),
        method: "POST",
      });
      const data = await response.json();
      dispatch(setAppliances(data.appliances));

      const timeFrom = getDatesMidnightTimeStamp(new Date(), 0);
      const timeTo = getDatesMidnightTimeStamp(new Date(), 1);
      const applianceIds = data.appliances.map((appliance: any) => appliance.id);
      const res = await fetch(import.meta.env.VITE_GET_UPTIME_FUNCTION_URL, {
        body: JSON.stringify({
          token,
          timeFrom,
          timeTo,
          applianceIds,
        }),
        method: "POST",
      });
      const uptimeData = await res.json();
      dispatch(setUptime(uptimeData.uptime));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
};
