import AsyncStorage from "@react-native-async-storage/async-storage";
const MEDICATION_STORAGEKEY = "@medication_storage_key";

export const storeMedications = async (value: Medication[]) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(MEDICATION_STORAGEKEY, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const getMedications = async (): Promise<Array<Medication> | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(MEDICATION_STORAGEKEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
