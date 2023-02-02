import { Flex } from "@chakra-ui/react";
import { Form } from "../components/Form";
import { FormProps } from "../components/Form/types/types";
import Navbar from "./NavBar";

const fields: FormProps["fields"] = {
  name: {
    type: "text",
    label: "Name",
  },
  age: {
    type: "number",
    label: "Age",
  },
  hobbies: {
    type: "array",
    label: "Hobbies",
    itemField: {
      type: "text",
      label: "",
    },
  },
  address: {
    type: "object",
    label: "Address",
    properties: {
      street: {
        type: "number",
        label: "Street",
      },
      city: {
        type: "text",
        label: "City",
      },
      state: {
        type: "text",
        label: "State",
      },
      zip: {
        type: "number",
        label: "Zip",
      },
    },
  },
};

const FormPage = () => {
  const handleSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <>
      <Navbar page="Form Component" />
      <Flex py={"8"} px={"16"}>
        <Form onSubmit={handleSubmit} fields={fields} />
      </Flex>
    </>
  );
};

export default FormPage;
