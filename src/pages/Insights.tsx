import { BarChart, Card, DonutChart, Title } from "@tremor/react";

import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useApplicationData } from "../hooks/useApplicationData";

const HOUR_IN_MS = 3600000;

const appliancePowerConsumptionFormatter = number =>
  `${new Intl.NumberFormat("sk").format(Math.round(number)).toString()}Wh`;

const applianceTotalUptimeFormatter = number =>
  `${new Intl.NumberFormat("sk").format(number.toFixed(2)).toString()} Hours`;

const formatAppliancePowerConsumption = appliancesPowerConsumption =>
  appliancesPowerConsumption.map(powerConsumption => ({
    "Appliance name": powerConsumption.applianceName,
    "Power consumption (Wh)": powerConsumption.powerConsumptionWattHours,
  }));

const formatApplianceUptime = appliancesUptime =>
  appliancesUptime.map(uptime => ({
    "Appliance name": uptime.applianceName,
    "Total uptime (Hours)": uptime.uptimeHours,
  }));

const Insights = () => {
  const appliances = useSelector(state => (state as any).appliances.appliances);
  const uptime = useSelector(state => (state as any).appliances.uptime);
  useApplicationData();

  const appliancesPowerConsumption = useMemo(
    () =>
      appliances.map((appliance: any) => ({
        applianceName: appliance.name,
        powerConsumptionWattHours:
          (uptime
            .find((upt: any) => upt.applianceId === appliance.id)
            ?.applianceUptimes?.reduce(
              (accumulator: number, uptimeEntry: number[]) =>
                accumulator + (uptimeEntry[1] - uptimeEntry[0]),
              0
            ) /
            HOUR_IN_MS) *
          appliance.powerInput,
      })),
    [uptime, appliances]
  );

  const appliancesTotalUptime = useMemo(
    () =>
      appliances.map((appliance: any) => ({
        applianceName: appliance.name,
        uptimeHours:
          uptime
            .find((upt: any) => upt.applianceId === appliance.id)
            ?.applianceUptimes?.reduce(
              (accumulator: number, uptimeEntry: number[]) =>
                accumulator + (uptimeEntry[1] - uptimeEntry[0]),
              0
            ) / HOUR_IN_MS,
      })),
    [uptime, appliances]
  );

  return (
    <>
      <NavBar displayLoginRegister={false} />
      <div className="flex flex-col items-center mt-8">
        <div className="w-4/5">
          <Card>
            <Title>Power consumption in Wh</Title>
            <DonutChart
              className="mt-6"
              data={formatAppliancePowerConsumption(appliancesPowerConsumption)}
              category="Power consumption (Wh)"
              index="Appliance name"
              valueFormatter={appliancePowerConsumptionFormatter}
              colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
            />
          </Card>
          <Card className="mt-8">
            <Title>Total appliances uptime in hours</Title>
            <BarChart
              className="mt-6"
              data={formatApplianceUptime(appliancesTotalUptime)}
              index="Appliance name"
              categories={["Total uptime (Hours)"]}
              colors={["blue"]}
              yAxisWidth={48}
              valueFormatter={applianceTotalUptimeFormatter}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default Insights;
