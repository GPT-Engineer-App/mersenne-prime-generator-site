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

  const calculateMersennePrimes = (p = 2) => {
    setCalculating(true);
    setProgress((prevProgress) => prevProgress + 1);

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

    setTimeout(() => {
      if (!calculating) return; // Stop if calculating has been set to false
      calculateMersennePrimes(p + 1); // Increase exponent and continue calculation
    }, 0);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => setCalculating(false); // This will cause the recursive setTimeout to stop calling itself
  }, []);

  return (
    <Box p={5}>
      <VStack spacing={5}>
        <Heading as="h1" size="xl">
          Mersenne Prime Calculator
        </Heading>
        <Text>Connect and calculate Mersenne primes together.</Text>
        <Button leftIcon={<FaCalculator />} colorScheme="teal" onClick={calculateMersennePrimes} isLoading={calculating} loadingText="Calculating">
          {calculating ? "Calculating..." : "Start Calculating"}
        </Button>
        <Progress value={progress} width="100%" colorScheme="teal" />
        <VStack spacing={2} align="stretch">
          {mersennePrimes.map((prime, index) => (
            <Box key={index} p={3} shadow="md" borderWidth="1px" display="flex" justifyContent="space-between">
              <Text>
                2<sup>{prime}</sup> - 1
              </Text>
              <Text fontWeight="bold">Exponent: {prime}</Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default Index;
