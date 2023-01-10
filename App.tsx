import React, { useEffect, useState } from "react";
import {
  Text,
  HStack,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Box,
  ScrollView,
  StatusBar,
  IconButton,
  Icon,
  Modal,
  FormControl,
  Input,
  Button,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { getMedications, storeMedications } from "./storage";
import { SSRProvider } from "react-aria";

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType {}
}

function MedicationCard({ medication }: { medication: Medication }) {
  return (
    <Box
      bg="white"
      shadow={1}
      rounded="lg"
      p="4"
      w="100%"
      mb="4"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <VStack alignItems="flex-start">
        <Text fontSize="lg" fontWeight="bold">
          {medication.name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {medication.dose}
        </Text>
      </VStack>
      <VStack alignItems="flex-end">
        <Text fontSize="lg" fontWeight="bold">
          {medication.time[0].time}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {medication.time[0].taken ? "Taken" : "Not Taken"}
        </Text>
      </VStack>
    </Box>
  );
}

function MedicationList(props: { data: Medication[] }) {
  return (
    <ScrollView>
      {props.data?.map((medication) => (
        <MedicationCard key={medication.id} medication={medication} />
      ))}
    </ScrollView>
  );
}

function AppBar() {
  return (
    <>
      <StatusBar />
      <Box safeAreaTop bg="violet.600" />
      <HStack
        bg="violet.600"
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
      >
        <HStack alignItems="center">
          <IconButton
            icon={
              <Icon size="sm" as={MaterialIcons} name="menu" color="white" />
            }
          />
          <Text color="white" fontSize="20" fontWeight="bold">
            Home
          </Text>
        </HStack>
        <HStack>
          <IconButton
            icon={
              <Icon
                as={MaterialIcons}
                name="favorite"
                size="sm"
                color="white"
              />
            }
          />
          <IconButton
            icon={
              <Icon as={MaterialIcons} name="search" size="sm" color="white" />
            }
          />
          <IconButton
            icon={
              <Icon
                as={MaterialIcons}
                name="more-vert"
                size="sm"
                color="white"
              />
            }
          />
        </HStack>
      </HStack>
    </>
  );
}

function AddMedicationPopup(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  setMedications: (medications: Medication[]) => void;
}) {
  const [meication, setMeication] = useState({
    id: Math.random().toString(36).substring(7),
    name: "",
    dose: "",
    frequency: "",
    duration: "",
    startedTaking: "",
    time: [
      {
        time: "",
        taken: false,
      },
    ],
  });

  const cancel = () => {
    props.setOpen(false);
  };

  const save = async () => {
    props.setOpen(false);
    const medications = await getMedications();
    await storeMedications([...(medications ?? []), meication]);
    props.setMedications([...(medications ?? []), meication]);
  };

  return (
    <Modal isOpen={props.open}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton onTouchEnd={cancel} />
        <Modal.Header>Add Medication</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Name</FormControl.Label>
            <Input
              onChangeText={(text) =>
                setMeication({ ...meication, name: text })
              }
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Dose</FormControl.Label>
            <Input
              onChangeText={(text) =>
                setMeication({ ...meication, dose: text })
              }
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Frequency</FormControl.Label>
            <Input
              onChangeText={(text) =>
                setMeication({ ...meication, frequency: text })
              }
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Duration</FormControl.Label>
            <Input
              onChangeText={(text) =>
                setMeication({ ...meication, duration: text })
              }
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Started Taking</FormControl.Label>
            <Input
              onChangeText={(text) =>
                setMeication({ ...meication, startedTaking: text })
              }
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Time</FormControl.Label>
            <Input />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group variant="ghost" space={2}>
            <Button onTouchEnd={cancel}>Cancel</Button>
            <Button colorScheme="blue" onTouchEnd={save}>
              Save
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

function AddMedicationButton(props: { onPress: () => void }) {
  return (
    <Box
      position="absolute"
      bottom="12"
      right="4"
      bg="violet.600"
      rounded="full"
      p="3"
      shadow={2}
    >
      <IconButton
        onPress={props.onPress}
        icon={<Icon as={MaterialIcons} name="add" size="xl" color="white" />}
      />
    </Box>
  );
}

export default function App() {
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    getMedications().then((medications) => setMedications(medications ?? []));
  }, [medications]);

  return (
    <SSRProvider>
      <NativeBaseProvider
        config={{
          strictMode: "warn",
        }}
      >
        <AppBar />
        <MedicationList data={medications} />
        <AddMedicationButton onPress={() => setAddPopupOpen(true)} />
        <AddMedicationPopup
          open={addPopupOpen}
          setOpen={setAddPopupOpen}
          setMedications={setMedications}
        />
      </NativeBaseProvider>
    </SSRProvider>
  );
}

// // Color Switch Component
// function ToggleDarkMode() {
//   const { colorMode, toggleColorMode } = useColorMode();
//   return (
//     <HStack space={2} alignItems="center">
//       <Text>Dark</Text>
//       <Switch
//         isChecked={colorMode === "light"}
//         onToggle={toggleColorMode}
//         aria-label={
//           colorMode === "light" ? "switch to dark mode" : "switch to light mode"
//         }
//       />
//       <Text>Light</Text>
//     </HStack>
//   );
// }
