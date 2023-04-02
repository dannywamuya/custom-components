import { Button } from "@chakra-ui/button";
import { Flex } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Spinner } from "@chakra-ui/spinner";
import { Tooltip } from "@chakra-ui/tooltip";
import { useState } from "react";
import { RxCursorArrow } from "react-icons/rx";
import { convertToTitleCase } from "../../../utils/textFormatter";
import { CustomSelectedRows } from "../types/table.types";

// Menu for select actions
export default function SelectActionsMenu<T>({
  selectedRows,
  selectActions,
}: {
  selectedRows: CustomSelectedRows<T>;
  selectActions: Array<{
    name: string;
    action: (rows: T[], updateLoading: () => void) => void;
  }>;
}) {
  const [loading, setLoading] = useState<Array<string>>([]);

  const updateLoading = (actionName: string) => {
    setLoading((prev) => {
      return prev.filter((item) => item !== actionName);
    });
  };

  return (
    <Flex>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={Button}
          rightIcon={<RxCursorArrow />}
          disabled={selectedRows.length === 0}
        >
          Select Actions {`(${selectedRows.length})`}
        </MenuButton>
        <MenuList>
          {selectActions.map(({ action, name }, idx) =>
            selectedRows.length === 0 ? (
              <MenuItem key={`${name}_${idx}`} isDisabled={true}>
                <Tooltip label="Select at least 1 row">
                  {convertToTitleCase(name)}
                </Tooltip>
              </MenuItem>
            ) : (
              <MenuItem
                key={`${name}_${idx}`}
                onClick={() => {
                  action(
                    selectedRows.map((r) => r.row),
                    () => updateLoading(name)
                  );
                  setLoading([...loading, name]);
                }}
                isDisabled={
                  selectedRows.length === 0 ||
                  (loading && loading.includes(name))
                }
                justifyContent={"space-between"}
              >
                {convertToTitleCase(name)}
                {loading && loading.includes(name) ? (
                  <Spinner ml={"2"} size={"sm"} />
                ) : null}
              </MenuItem>
            )
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
}
