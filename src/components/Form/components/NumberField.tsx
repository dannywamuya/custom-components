import { FormLabel, Input } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { NumberFieldProps } from "../types/types";

function NumberField(props: NumberFieldProps & { name: string }) {
  const { register } = useFormContext();
  const { label, name, placeholder } = props;

  return (
    <div>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        id={name}
        type="number"
        placeholder={placeholder}
        {...register(name)}
      />
    </div>
  );
}

export default NumberField;
