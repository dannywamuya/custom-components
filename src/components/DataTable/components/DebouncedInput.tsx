import { SearchIcon } from "@chakra-ui/icons";
import {
  InputProps,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/input";
import { useState, useEffect } from "react";

// A debounced input react component
export default function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  searchIcon = false,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  searchIcon?: boolean;
} & Omit<InputProps, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <InputGroup size={"sm"}>
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {searchIcon ? <InputRightElement children={<SearchIcon />} /> : null}
    </InputGroup>
  );
}
