import { Card, Text, Metric, Flex, Switch, TextInput } from "@tremor/react";

import lightBulb from "../assets/images/light-bulb.png";
import airConditioner from "../assets/images/air-conditioner.png";
import dishWasher from "../assets/images/dish-washer.png";
import television from "../assets/images/television.png";
import vacuum from "../assets/images/vacuum.png";
import { ApplianceType } from "../types";

type ApplianceCardProps = {
  id: string;
  name: string;
  powerInput: number;
  type: ApplianceType;
  isPoweredOn: boolean;
  onSwitch: (id: string, value: boolean) => void;
};

export const ApplianceCard = ({
  id,
  type,
  powerInput,
  name,
  isPoweredOn,
  onSwitch,
}: ApplianceCardProps) => {
  const getApplianceIcon = (appliance: ApplianceType) => {
    switch (appliance) {
      case ApplianceType.AIR_CONDITIONER:
        return airConditioner;
      case ApplianceType.DISH_WASHER:
        return dishWasher;
      case ApplianceType.LIGHT_BULB:
        return lightBulb;
      case ApplianceType.TELEVISION:
        return television;
      case ApplianceType.VACUUM:
        return vacuum;
      default:
        return lightBulb;
    }
  };

  return (
    <Card className="p-8 mx-auto mb-8">
      <Flex>
        <img src={getApplianceIcon(type)} alt="appliance-icon" />
        <Metric className="text-tremor-brand">{name}</Metric>
      </Flex>
      <Flex className="mt-6">
        <span className="flex items-center">
          <Text className="mr-4">Power usage: </Text>
          <Metric>{powerInput}W</Metric>
        </span>
        <Switch checked={isPoweredOn} onChange={value => onSwitch(id, value)} />
      </Flex>
      <Flex className="mt-6">
        <Text className="mr-4 min-w-fit">Appliance id: </Text>
        <TextInput value={id} disabled />
      </Flex>
    </Card>
  );
};

export default ApplianceCard;
