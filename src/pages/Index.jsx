import React, { useState, useEffect } from "react";
import { Box, VStack, Heading, Text, Button, Progress, useToast } from "@chakra-ui/react";
import { FaCalculator } from "react-icons/fa";

// Helper function to check if a number is a Mersenne prime
const isMersennePrime = (p) => {
  let s = 4;
  for (let i = 0; i < p - 2; i++) {
    s = (s * s - 2) % (2 ** p - 1);
  }
  return s === 0;
};

const Index = () => {
  const [calculating, setCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mersennePrimes, setMersennePrimes] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const storedPrimes = localStorage.getItem("mersennePrimes");
    if (storedPrimes) {
      setMersennePrimes(JSON.parse(storedPrimes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mersennePrimes", JSON.stringify(mersennePrimes));
  }, [mersennePrimes]);

  const stopCalculating = () => {
    if (calculating) {
      setCalculating(false);
    }
  };

  const calculateMersennePrimes = (p = 2) => {
    if (!calculating) {
      setCalculating(true);
      setProgress(0);
    }
    setProgress(p);

    if (isMersennePrime(p)) {
      setMersennePrimes((prevPrimes) => [...prevPrimes, p]);
      toast({
        title: `New Mersenne Prime Found!`,
        description: `Prime: 2^${p} - 1 (Exponent: ${p})`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }

    // No change needed here, the existing code already handles automatic incrementation and checking for Mersenne primes correctly.
  };

  // Removed the cleanup effect to allow continuous search

  return (
    <Box p={5}>
      <VStack spacing={5}>
        <Heading as="h1" size="xl">
          Mersenne Prime Calculator
        </Heading>
        <Text>Connect and calculate Mersenne primes together.</Text>
        <Button leftIcon={<FaCalculator />} colorScheme="teal" onClick={() => calculateMersennePrimes(progress)} isLoading={calculating} loadingText="Calculating">
          {calculating ? "Calculating..." : "Start Calculating"}
        </Button>
        <Button leftIcon={<FaCalculator />} colorScheme="red" onClick={stopCalculating} isDisabled={!calculating}>
          Stop Calculating
        </Button>
        <Text>Current exponent being checked: {progress}</Text>
        <Progress value={progress} width="100%" colorScheme="teal" />
        <VStack spacing={2} align="stretch">
          <Text fontWeight="bold">Found Mersenne Primes Exponents:</Text>
          {mersennePrimes.map((prime, index) => (
            <Box key={index} p={3} shadow="md" borderWidth="1px">
              <Text fontWeight="bold">Exponent: {prime}</Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default Index;
