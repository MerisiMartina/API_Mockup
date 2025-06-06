import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity, 
  RefreshControl, 
  Modal, 
  TextInput, 
  Button, 
  Alert 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign, Feather } from '@expo/vector-icons';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch('https://6620bff93bf790e070b07208.mockapi.io/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      Alert.alert('Error', 'Failed to fetch users: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`https://6620bff93bf790e070b07208.mockapi.io/users/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Failed to delete user: ' + error.message);
    }
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.username || !newUser.email) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    try {
      const response = await fetch('https://6620bff93bf790e070b07208.mockapi.io/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      
      setModalVisible(false);
      setNewUser({
        name: '',
        username: '',
        email: '',
        phone: '',
        avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
      });
      fetchData();
    } catch (error) {
      console.error('Add error:', error);
      Alert.alert('Error', 'Failed to add user: ' + error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cella}>
      <Image
        source={{ uri: item.avatar || 'https://i.pravatar.cc/150?img=0' }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.name || 'No name'} {item.username || ''}</Text>
        <Text>{item.email || 'No email'}</Text>
        <Text>{item.phone || 'No phone'}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteUser(item.id)}
      >
        <Feather name="trash-2" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={fetchData} />
        </View>
      ) : (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text>No users found</Text>
              </View>
            }
          />
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <AntDesign name="plus" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New User</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name*"
              value={newUser.name}
              onChangeText={(text) => setNewUser({...newUser, name: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Username*"
              value={newUser.username}
              onChangeText={(text) => setNewUser({...newUser, username: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email*"
              value={newUser.email}
              onChangeText={(text) => setNewUser({...newUser, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={newUser.phone}
              onChangeText={(text) => setNewUser({...newUser, phone: text})}
              keyboardType="phone-pad"
            />
            
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="#999"
              />
              <Button
                title="Add"
                onPress={addUser}
                disabled={!newUser.name || !newUser.username || !newUser.email}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  cella: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default App;
