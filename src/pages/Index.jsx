import React, { useState, useEffect, useRef } from "react";
import { Container, VStack, HStack, Box, Text, Button, CircularProgress, CircularProgressLabel, Heading, Icon, SimpleGrid } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

const Gauge = ({ label, value, max }) => (
  <Box textAlign="center">
    <CircularProgress value={value} max={max} size="120px" thickness="12px">
      <CircularProgressLabel>{value}</CircularProgressLabel>
    </CircularProgress>
    <Text mt={2}>{label}</Text>
  </Box>
);

const Timer = ({ setRemainingTime }) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  const batteryLife = 3600;

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setRemainingTime(batteryLife - time);
    } else if (!isActive && time !== 0) {
      setRemainingTime(batteryLife - time);
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, time]);

  const formatTime = (time) => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = `${Math.floor(time / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <Box textAlign="center">
      <Text fontSize="2xl">{formatTime(time)}</Text>
      <HStack spacing={4} mt={4}>
        <Button onClick={() => setIsActive(true)} colorScheme="green" leftIcon={<FaPlay />}>
          Start
        </Button>
        <Button onClick={() => setIsActive(false)} colorScheme="red" leftIcon={<FaPause />}>
          Stop
        </Button>
        <Button
          onClick={() => {
            setTime(0);
            setIsActive(false);
          }}
          colorScheme="blue"
          leftIcon={<FaRedo />}
        >
          Reset
        </Button>
      </HStack>
    </Box>
  );
};

const RemainingBatteryTime = ({ remainingTime }) => (
  <Box textAlign="center" mt={4}>
    <Text fontSize="xl">Remaining Battery Time: {remainingTime > 0 ? `${Math.floor(remainingTime / 60)}m ${remainingTime % 60}s` : "0m 0s"}</Text>
  </Box>
);

const Index = () => {
  const [remainingTime, setRemainingTime] = useState(3600);
  const [speed, setSpeed] = useState(50);
  const [panelVoltage, setPanelVoltage] = useState(12);
  const [batteryVoltage, setBatteryVoltage] = useState(12);
  const [motorVoltage, setMotorVoltage] = useState(24);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={8} width="100%">
        <Heading as="h1" size="lg" textAlign="center" mb={8}>
          SuncaTcHer -Bootsstation
        </Heading>
        <HStack spacing={8} width="100%" justifyContent="center">
          <Gauge label="Speed" value={speed} max={100} />
          <Timer setRemainingTime={setRemainingTime} />
          <Gauge label="Remaining Battery Time" value={remainingTime / 60} max={60} />
        </HStack>
        <HStack spacing={4} width="100%" mt={8} justifyContent="center">
          <Gauge label="Panel Voltage" value={panelVoltage} max={24} />
          <Icon as={FaArrowRight} boxSize={6} />
          <Gauge label="Battery Voltage" value={batteryVoltage} max={24} />
          <Icon as={FaArrowRight} boxSize={6} />
          <Gauge label="Motor Voltage" value={motorVoltage} max={48} />
        </HStack>
      </VStack>
    </Container>
  );
};

export default Index;
