import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'react-native';

export default function App() {

const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
fetchData();
}, []);

const fetchData = async () => {
try {
setLoading(true);
const response = await fetch('https://6839579f6561b8d882afff50.mockapi.io/users:users');
const json = await response.json();
console.log(json);
setData(json);
} catch (error) {
console.error(error);
}
finally {
setLoading(false);
}
}

return (
<View style={styles.container}>
{loading ? (
<ActivityIndicator size="large" color="#0000ff" />
) : (
<FlatList
data={data}
keyExtractor={(item) => item.id.toString()}
renderItem={({ item }) => (
<View style={styles.cella}>
<Text>{item.name}</Text>
<Text>{item.surname}</Text>
<Image
source={{ uri: item.avatar }}
style={{ width: 50, height: 50, borderRadius: 25 }}/>
</View>
)}
/>)}
</View>
);
}


const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
alignItems: 'center',
justifyContent: 'center',
},
cella: {
width: '100%',
height: 100,
backgroundColor: '#fff',
borderBottomWidth: 1,
borderBottomColor: '#ccc',
justifyContent: 'center',
paddingLeft: 10,
},
});