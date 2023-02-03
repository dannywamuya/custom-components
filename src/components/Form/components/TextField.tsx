import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { TextFieldProps } from "../types/types";

function TextField(props: TextFieldProps & { name: string }) {
  const { register } = useFormContext();
  const { label, name, htmlType = "text", placeholder } = props;

  return (
    <>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        id={name}
        type={htmlType}
        placeholder={placeholder}
        {...register(name)}
      />
    </>
  );
}

export default TextField;
