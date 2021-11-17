import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  useEditableControls,
} from '@chakra-ui/react';

type PropTypesUserNameInput = {
  userName: string;
  handleUserChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const UserNameInput = ({ userName, handleUserChange }: PropTypesUserNameInput) => {
  const EditableControls = () => {
    const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton color="green.500" aria-label="Save Username" icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton
          color="red.500"
          aria-label="Cancel Edit Username"
          icon={<CloseIcon />}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          color="cyan.500"
          aria-label="Edit Username"
          size="sm"
          icon={<EditIcon />}
          {...getEditButtonProps()}
        />
      </Flex>
    );
  };

  return (
    <Editable
      my={2}
      bg={'purple.500'}
      placeholder="add a username"
      value={userName}
      textAlign="center"
      defaultValue="Rasengan ⚡️"
      fontSize="2xl"
      isPreviewFocusable={false}
    >
      <EditablePreview />
      <EditableInput onChange={handleUserChange} />
      <EditableControls />
    </Editable>
  );
};

export { UserNameInput };
