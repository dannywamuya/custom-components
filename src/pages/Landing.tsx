import { Flex, OrderedList, ListItem, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-location";
import Navbar from "./NavBar";

const LandingPage = () => {
  return (
    <>
      <Navbar page="Reusable React Components" />
      <Flex direction={"column"} p={"4"}>
        <Text fontSize={"xl"} fontWeight={"bold"}>
          Components
        </Text>
        <OrderedList>
          <ListItem>
            <Link to={"/table"}>
              <Text _hover={{ color: "blue" }}>Table Component</Text>
            </Link>
          </ListItem>
          <ListItem>
            <Link to={"/form"}>
              <Text _hover={{ color: "blue" }}>Form Component</Text>
            </Link>
          </ListItem>
        </OrderedList>
      </Flex>
    </>
  );
};

export default LandingPage;
