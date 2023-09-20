import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Details = ({route, navigation}) => {
  const {item} = route.params;
  const [notes, setNotes] = useState([]);
  const [name, setName] = useState(item.name);
  const [email, setEmail] = useState(item.email);
  const [mobile, setMobile] = useState(item.mobile);
  const [libDetails, setLibDetails] = useState(item.libDetails);
  const [remark, setRemark] = useState(item.remark);
  const [nameError, setnameError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const date =
    new Date().toDateString() +
    ' , ' +
    new Date().getHours() +
    ':' +
    new Date().getMinutes() +
    ':' +
    new Date().getSeconds();

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.show('Edited Successfully !', ToastAndroid.SHORT);
  };
  const showErrorname = () => {
    ToastAndroid.show('Please Enter Your Name', ToastAndroid.SHORT);
  };
  const showErroremail = () => {
    ToastAndroid.show('Please Enter Email Address', ToastAndroid.SHORT);
  };
  const showErrormobile = () => {
    ToastAndroid.show('Please Enter Valid Mobile No. ', ToastAndroid.SHORT);
  };

  const Save = async () => {
    if (name === '' || mobile === '' || email === '') {
      if (name === '') {
        setnameError(true);
        showErrorname();
      } else {
        if (mobile === '' || mobile.length <= 9) {
          showErrormobile();
          setMobileError(true);
        } else {
          if (email === '') {
            showErroremail();
            setEmailError(true);
          }
        }
      }
    } else {
      console.log('Code Next For Save It');
      const result = await AsyncStorage.getItem('DATA');
      let notes = [];
      if (result !== null) notes = JSON.parse(result);
      const newNotes = notes.filter(n => {
        if (n.id === item.id) {
          n.name = name.replace(/\s/g, ' ').split(/[ ]+/).join(' ');
          n.mobile = mobile.replace(/\s/g, ' ').split(/[ ]+/).join(' ');
          n.email = email.replace(/\s/g, ' ').split(/[ ]+/).join(' ');
          n.libDetails = libDetails.replace(/\s/g, ' ').split(/[ ]+/).join(' ');
          n.remark = remark.replace(/\s/g, ' ').split(/[ ]+/).join(' ');
          n.date = date;
        }
        return n;
      });
      setNotes(newNotes);
      showToastWithGravityAndOffset();
      console.log('Edited', notes);
      await AsyncStorage.setItem('DATA', JSON.stringify(notes));
      navigation.navigate('Schedules');
    }
  };

  return (
    <SafeAreaProvider style={{height: '100%'}}>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.container}>
            <View Style={styles.Inputs}>
              <Text style={styles.placeholder}>
                Name{' '}
                {nameError ? (
                  <Text style={{color: 'red'}}>*</Text>
                ) : (
                  <Text style={{color: 'red'}}>*</Text>
                )}
              </Text>
              <TextInput
                value={name}
                onChangeText={val => setName(val)}
                style={styles.Text}></TextInput>
            </View>
            <View Style={styles.Inputs}>
              <Text style={styles.placeholder}>
                Mobile {' '}
                {mobileError ? (
                  <Text style={{color: 'red'}}>*</Text>
                ) : (
                  <Text style={{color: 'red'}}>*</Text>
                )}
              </Text>
              <TextInput
                maxLength={10}
                keyboardType={'numeric'}
                value={mobile}
                onChangeText={val => setMobile(val)}
                style={styles.Text}></TextInput>
            </View>
            <View Style={styles.Inputs}>
              <Text style={styles.placeholder}>
                Email{' '}
                {emailError ? (
                  <Text style={{color: 'red'}}>*</Text>
                ) : (
                  <Text style={{color: 'red'}}>*</Text>
                )}
              </Text>
              <TextInput
                value={email}
                onChangeText={val => setEmail(val)}
                style={styles.Text}></TextInput>
            </View>
            <View Style={styles.Inputs}>
              <Text style={styles.placeholder}>Library Details</Text>
              <TextInput
                multiline={true}
                value={libDetails}
                textAlignVertical="top"
                onChangeText={val => setLibDetails(val)}
                style={styles.remark}></TextInput>
            </View>
            <View Style={styles.Inputs}>
              <Text style={styles.placeholder}>Remark</Text>
              <TextInput
                multiline={true}
                numberOfLines={10}
                value={remark}
                textAlignVertical="top"
                onChangeText={val => setRemark(val)}
                style={styles.remark}></TextInput>
            </View>
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#1aab0f',
                  width: '89.8%',
                  color: '#4a3bd1',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 45,
                  borderRadius: 7,
                  marginTop: 10,
                  borderColor: 'green',
                  marginBottom: 0,
                  marginTop: 30,
                  marginLeft: 6,
                  borderWidth: 0.3,
                }}
                onPress={Save}>
                <Text style={{color: '#fff', margin: 5}}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 0,
    paddingBottom: '24%',
    height: 700,
    paddingLeft: '7%',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  Inputs: {
    paddingLeft:25,
    width: '95%',
    height: 30,
    color: '#000',
    fontSize: 15,
  },
  placeholder: {
    marginLeft: 8,
    marginTop: '4%',
    width: '80%',
    height: 20,
    color: '#000',
    fontSize: 15,
  },
  Text: {
    marginTop: '2%',
    color: '#000',
    fontSize: 15,
    marginLeft: 5,
    paddingLeft:10,
    width: '90%',
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#999',
  },
  remark: {
    marginTop: '2%',
    color: '#000',
    marginLeft: 5,
    fontSize: 15,
    width: '90%',
    paddingLeft:10,
    height: 100,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#999',
  },
  Btn: {
    width: 200,
    height: 50,
    marginLeft: 35,
    marginTop: 35,
  },
});
