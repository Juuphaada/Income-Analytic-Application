import {
  StatusBar,
  StyleSheet,
  View
} from "react-native";

import { DeleteConfirmPopup } from "@/components/income-tracker/delete-confirm";
import { Form } from "@/components/income-tracker/form";
import { Header } from "@/components/income-tracker/header";
import { Info } from "@/components/income-tracker/info";
import { Table } from "@/components/income-tracker/table";
import { COLORS } from "@/constants/theme";
import { DividendContextProvider } from "@/Context/dividendContext";
import { FormContextProvider } from "@/Context/formContext";

export default function App() {
  return (
    <DividendContextProvider>
      <FormContextProvider>
        <View style={s.root}>

            <StatusBar barStyle="dark-content" />
            
            <Header/>

            <Info/>
            
            <Table/>
            
            <DeleteConfirmPopup/>

            <Form/>
        </View>
      </FormContextProvider>
    </DividendContextProvider>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background }
})
