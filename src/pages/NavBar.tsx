import { Flex, Text } from "@chakra-ui/react";
import { Link, useMatch } from "@tanstack/react-location";

const Navbar = ({ page }: { page: string }) => {
  const { pathname } = useMatch();
  const onHomePage = pathname === "/";

  return (
    <Flex
      w="full"
      bg={"black"}
      p="4"
      justify={!onHomePage ? "space-between" : "center"}
    >
      {!onHomePage ? (
        <Link to={"/"}>
          <Text fontSize={"xl"} color={"white"}>
            Home
          </Text>
        </Link>
      ) : null}
      <Text fontSize={"xl"} color={"white"}>
        {page}
      </Text>
    </Flex>
  );
};

export default Navbar;
