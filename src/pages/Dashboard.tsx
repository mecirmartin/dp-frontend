import { Grid, Col, Button, TextInput, Metric, Select, SelectItem, Flex } from "@tremor/react";
import { useMemo, useState } from "react";
import Modal from "react-modal";

import NavBar from "../components/NavBar";
import ApplianceCard from "../components/Card";
import { ApplianceType } from "../types";
import useToken from "../hooks/useToken";
import { useDispatch, useSelector } from "react-redux";
import { setAppliances } from "../features/appliancesSlice";
import { useApplicationData } from "../hooks/useApplicationData";

const splitArray = <T,>(arr: T[]) => {
  const middle = Math.ceil(arr.length / 2);
  const firstHalf = arr.slice(0, middle);
  const secondHalf = arr.slice(middle);
  return [firstHalf, secondHalf];
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    width: "50vw",
    height: "50vh",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "1px solid rgb(59, 130, 246)",
  },
};

Modal.setAppElement("#root");

const Dashboard = () => {
  const appliances = useSelector(state => (state as any).appliances.appliances);
  const user = useSelector(state => (state as any).appliances.user);
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [powerInput, setPowerInput] = useState("");
  const [applianceType, setApplianceType] = useState(ApplianceType.VACUUM);

  const { token } = useToken();
  useApplicationData();

  const applianceArrays = useMemo(() => splitArray(appliances), [appliances]);

  const updateAppliance = (id: string, isPoweredOn: boolean) => {
    fetch(import.meta.env.VITE_UPDATE_APPLIANCE_FUNCTION_URL, {
      body: JSON.stringify({ id, isPoweredOn, token }),
      method: "POST",
    });
  };

  const onSwitch = (id: string, isPoweredOn: boolean) => {
    const newAppliances = appliances.map((appliance: any) =>
      appliance.id === id ? { ...appliance, isPoweredOn } : appliance
    );
    dispatch(setAppliances(newAppliances));
    updateAppliance(id, isPoweredOn);
  };

  const createAppliance = async () => {
    if (name && powerInput) {
      const response = await fetch(import.meta.env.VITE_CREATE_APPLIANCE_FUNCTION_URL, {
        body: JSON.stringify({ name, powerInput, isPoweredOn: false, applianceType, token }),
        method: "POST",
      });
      if (response.status === 200) {
        dispatch(
          setAppliances([...appliances, { name, powerInput, isPoweredOn: false, applianceType }])
        );
        setModalIsOpen(false);
      }
    }
  };

  const mapAppliances = (appliances: any[]) =>
    appliances.map(({ name, applianceType, id, powerInput, isPoweredOn }) => (
      <ApplianceCard
        key={id}
        id={id}
        name={name}
        type={applianceType}
        powerInput={powerInput}
        isPoweredOn={isPoweredOn}
        onSwitch={onSwitch}
      />
    ));

  return (
    <>
      <NavBar displayLoginRegister={false} />
      <div className="flex justify-center w-full my-32 text-5xl font-semibold text-gray-700">
        <div className="w-4/5">
          <h1 className="">
            Hi {user.firstName ?? ""} {user.lastName ?? ""} welcome to your dashboard
          </h1>
          <Grid numItemsSm={1} numItemsMd={2} className="gap-8 mt-24 gap-y-8">
            <Col>{mapAppliances(applianceArrays[0])}</Col>
            <Col>{mapAppliances(applianceArrays[1])}</Col>
          </Grid>
          <Button onClick={() => setModalIsOpen(true)}>Add appliance</Button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Metric className="mt-8">Add appliance</Metric>
        <TextInput
          placeholder="Name of appliance"
          className="mt-12"
          value={name}
          onChange={event => setName(event.target.value)}
        />
        <TextInput
          placeholder="Power input of appliance"
          className="mt-8"
          value={powerInput}
          onChange={event => setPowerInput(event.target.value)}
        />
        <Select
          className="mt-8"
          value={applianceType}
          onValueChange={value => setApplianceType(value as ApplianceType)}
        >
          {Object.values(ApplianceType).map((applianceType, index) => (
            <SelectItem key={index} value={applianceType}>
              {applianceType}
            </SelectItem>
          ))}
        </Select>
        <Flex justifyContent="end" className="mt-12">
          <Button type="submit" size="xl" onClick={createAppliance}>
            Create appliance
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default Dashboard;
