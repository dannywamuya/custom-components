import { Flex } from "@chakra-ui/react";
import { Form } from "../components/Form";
import { FormProps } from "../components/Form/types/form.types";
import Navbar from "./NavBar";

const fields: FormProps["fields"] = {
  name: {
    type: "text",
    label: "Name",
  },
  year: {
    type: "text",
    label: "Year",
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
      placeholder: "Hobby",
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
      country: {
        type: "text",
        label: "Country",
      },
      continent: {
        type: "text",
        label: "Continent",
      },
    },
    styling: {
      fieldsPerColumn: 3,
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

      <Form
        onSubmit={handleSubmit}
        fields={fields}
        styling={{ fieldsPerColumn: 2 }}
      />
    </>
  );
};

export default FormPage;
