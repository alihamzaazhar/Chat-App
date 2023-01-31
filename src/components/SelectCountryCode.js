import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { COUNTRIES } from "./Countries";
const SelectCountryCode = () => {
  const [data, setData] = useState(COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState('');
  const onSearch = (text) => {
    if(text !== ''){
        let tempData = data.filter((item)=> {
            return item.name.toLowerCase().indexOf(text.toLowerCase()) > -1;
       });
       setData(tempData)
    }
    else{
        setData(COUNTRIES)
    }

  }

  return (
    <View style={styles.SafeAreaView}>
      <View style={styles.container}>
        <TextInput
          placeholder="Search your country"
          style={styles.searchInputContainer}
          placeholderTextColor={"#ffff"}
          onChangeText={text => onSearch(text)}
        />       
        <FlatList 
        data={data}
        keyExtractor={(item, index)=> index.toString()}
        renderItem={({item, index})=> (
            <TouchableOpacity onPress={()=> {
                setSelectedCountry(item.name)
                onSearch('')
            }}>
            <View style={styles.countryItems}>
                <Image source={item.flag} style={styles.img}/>
                <Text style={{color: "#fff", marginLeft: 20}}>{item.name} ({item.mobileCode})</Text>
            </View>
            </TouchableOpacity>

                
            )
        }
        />
      </View>
    </View>
  );
};

export default SelectCountryCode;

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: "#0F1828",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  countryItems: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderBottomWidth: .8,
    borderBottomColor: "#fff",
  },
  searchInputContainer: {
    marginTop: 30,
    backgroundColor: "#152033",
    width: "100%",
    borderRadius: 4,
    marginLeft: 5,
    height: 50,
    color: "#fff"
  }
});
