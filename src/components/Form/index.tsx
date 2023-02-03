import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
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
  const { label, name, properties, styling = {} } = props;
  const { fieldsPerColumn } = styling;

  return (
    <Flex direction={"column"}>
      <FormLabel>{label}</FormLabel>
      <Grid
        gap={"2"}
        w={"full"}
        templateColumns={`repeat(${fieldsPerColumn ?? 2}, 1fr)`}
      >
        {Object.entries(properties).map(([fieldName, objectField], idx) => {
          return (
            <GridItem key={`${name}.${fieldName}_${idx}`}>
              {renderFields([`${name}.${fieldName}`, objectField])}
            </GridItem>
          );
        })}
      </Grid>
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

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name,
    rules: { minLength: 4 },
  });

  function add() {
    prepend(appendDefaults[itemField.type]);
  }

  return (
    <>
      <Flex>
        <FormLabel>{label}</FormLabel>
        <IconButton
          onClick={add}
          variant={"outline"}
          type="button"
          size={"xs"}
          icon={<AddIcon />}
          aria-label={`Add field to ${label}`}
        />
      </Flex>

      <Flex>
        {fields.map((item, i) => {
          return (
            <Flex
              key={`ArrayField__${name}_${item.id}`}
              align={"center"}
              gap={"2"}
            >
              <>{renderFields([`${name}[${i}]`, itemField])}</>
              <IconButton
                onClick={() => remove(i)}
                variant={"outline"}
                type="button"
                size={"xs"}
                icon={<MinusIcon />}
                aria-label={`Remove field from ${label}`}
              />
            </Flex>
          );
        })}
      </Flex>
    </>
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

export function Form({ fields, onSubmit, styling = {} }: FormProps) {
  const form = useForm();

  const { fieldsPerColumn } = styling;

  return (
    <Flex p={"2"}>
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
            <Grid
              templateColumns={`repeat(${fieldsPerColumn ?? 1}, 1fr)`}
              gap={6}
            >
              {Object.entries(fields).map((field, idx) => (
                <GridItem w="100%" key={idx}>
                  {renderFields(field)}
                </GridItem>
              ))}
            </Grid>

            <Button type="submit" my={"2"}>
              Save
            </Button>
          </form>
        </Flex>
      </FormProvider>
    </Flex>
  );
}
