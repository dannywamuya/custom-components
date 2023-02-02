import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import NumberField from "./components/NumberField";
import TextField from "./components/TextField";
import {
  ArrayFieldProps,
  Field,
  FormProps,
  ObjectFieldProps,
} from "./types/types";

function ObjectField(props: ObjectFieldProps & { name: string }) {
  const { label, name, properties } = props;

  return (
    <Flex direction={"column"}>
      <FormLabel>{label}</FormLabel>
      <Flex gap={"2"} w={"full"}>
        {Object.entries(properties).map(([fieldName, objectField], idx) => {
          return (
            <div key={`${name}.${fieldName}_${idx}`}>
              {renderFields([`${name}.${fieldName}`, objectField])}
            </div>
          );
        })}
      </Flex>
    </Flex>
  );
}

const appendDefaults = {
  text: "",
  number: 0,
  array: [],
  object: {},
};

function ArrayField(props: ArrayFieldProps & { name: string }) {
  const { name, itemField, label } = props;

  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  function add() {
    append(appendDefaults[itemField.type]);
  }

  return (
    <Box>
      <Flex align={"center"} gap={"2"}>
        <FormLabel>{label}</FormLabel>
        <IconButton
          onClick={add}
          variant={"outline"}
          icon={<AddIcon />}
          aria-label={`Add field to ${label}`}
        />
      </Flex>

      <Flex align={"center"} gap={"2"}>
        {fields.map((item, i) => {
          return (
            <Flex
              key={`ArrayField__${name}_${item.id}`}
              align={"center"}
              gap={"2"}
            >
              <Flex>{renderFields([`${name}[${i}]`, itemField])}</Flex>
              <IconButton
                onClick={() => remove(i)}
                variant={"outline"}
                icon={<MinusIcon />}
                aria-label={`Remove field from ${label}`}
              />
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}

function renderFields([name, fieldProps]: [string, Field]) {
  if (fieldProps.type === "text") {
    return <TextField {...fieldProps} name={name} />;
  }
  if (fieldProps.type === "number") {
    return <NumberField {...fieldProps} name={name} />;
  }
  if (fieldProps.type === "object") {
    return <ObjectField {...fieldProps} name={name} />;
  }
  if (fieldProps.type === "array") {
    return <ArrayField {...fieldProps} name={name} />;
  }

  return <div>Unknown type</div>;
}

export function Form({ fields, onSubmit }: FormProps) {
  const form = useForm();

  return (
    <FormProvider {...form}>
      <Flex
        p={"4"}
        borderRadius={"md"}
        border={"1px"}
        borderColor={"lightgray"}
        direction={"column"}
        w={"full"}
        overflow={"auto"}
        boxShadow="0 0 25px rgba(0, 0, 0, 0.274)"
      >
        <Heading size={"md"} mb={"4"}>
          Form
        </Heading>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {Object.entries(fields).map((field, idx) => (
            <Flex my={"4"} key={idx}>
              {renderFields(field)}
            </Flex>
          ))}

          <Button type="submit" my={"2"}>
            Save
          </Button>
        </form>
      </Flex>
    </FormProvider>
  );
}
