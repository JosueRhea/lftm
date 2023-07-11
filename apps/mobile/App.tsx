import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Let's see what can i d
        o here?</Text>
      <StatusBar style="auto" />
      <Pressable style={{
        width: "100%",
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: "#eee",
        borderRadius:10, 
       marginTop: 10,       
      }} onPress={() => {
        console.log("Pressed")
      }}> 
        <Text style={{textAlign: "center"}}>Click me too</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
});
