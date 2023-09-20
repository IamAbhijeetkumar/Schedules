import {
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

let arr = [];
const NewSchedule = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [nameError, setnameError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [data, setData] = useState({
    name: '',
    mobile: '',
    email: '',
    libDetails: '',
    remark: '',
    date:
      new Date().toDateString() +
      ' , ' +
      new Date().getHours() +
      ':' +
      new Date().getMinutes() +
      ':' +
      new Date().getSeconds(),
    id:
      new Date().toDateString() +
      ' , ' +
      new Date().getHours() +
      ':' +
      new Date().getMinutes() +
      ':' +
      new Date().getSeconds(),
  });

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.show('Saved Successfully !', ToastAndroid.SHORT);
  };
  const showErrorname = () => {
    ToastAndroid.show('Please Enter Your Name', ToastAndroid.SHORT);
  };
  const showErroremail = () => {
    ToastAndroid.show('Please Enter Email ', ToastAndroid.SHORT);
  };
  const showErrormobile = () => {
    ToastAndroid.show('Please Enter Valid Mobile No. ', ToastAndroid.SHORT);
  };

  const saveData = async () => {
    if (data.name === '' || data.email === '' || data.mobile === '') {
      if (data.name === '') {
        showErrorname();
        setnameError(true);
      } else {
        if (data.mobile === '' || data.mobile.length <= 9) {
          showErrormobile();
          setMobileError(true);
        } else {
          if (data.email === '') {
            showErroremail();
            setEmailError(true);
          }
        }
      }
    } else {
      setLoader(true);
      arr = [];
      let tempArr = [];
      tempArr = JSON.parse(await AsyncStorage.getItem('DATA'));
      if (tempArr !== null) {
        tempArr.map(item => {
          arr.push(item);
        });
        arr.push({
          name: data.name.replace(/\s/g, ' ').split(/[ ]+/).join(' '),
          mobile: data.mobile.replace(/\s/g, ' ').split(/[ ]+/).join(' '),
          email: data.email.replace(/\s/g, ' ').split(/[ ]+/).join(' '),
          libDetails: data.libDetails
            .replace(/\s/g, ' ')
            .split(/[ ]+/)
            .join(' '),
          remark: data.remark.replace(/\s/g, ' ').split(/[ ]+/).join(' '),
          date: data.date,
          id: data.id,
        });
      } else {
        arr.push({
          name: data.name.replace(/\s/g, ' ').split(/[ ]+/).join(' '),
          mobile: data.mobile.replace(/\s/g, ' ').split(/[ ]+/).join(' '),
          email: data.email.replace(/\s/g, ' ').split(/[ ]+/).join(' '),
          libDetails: data.libDetails
            .replace(/\s/g, ' ')
            .split(/[ ]+/)
            .join(' '),
          remark: data.remark.replace(/\s/g, ' ').split(/[ ]+/).join(' '),
          date: data.date,
          id: data.id,
        });
      }
      await AsyncStorage.setItem('DATA', JSON.stringify(arr));
      showToastWithGravityAndOffset();
      navigation.navigate('Schedules');
    }
  };


  return (
    <SafeAreaProvider style={{height: '100%'}}>
      <KeyboardAvoidingView>
        <ScrollView>
          {loader ? (
            <View style={{justifyContent: 'center', height: 600}}>
              <ActivityIndicator size={50} />
            </View>
          ) : (
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
                  required
                  value={data.name}
                  onChangeText={val =>
                    setData({...data, name: val}, setnameError(true))
                  }
                  style={styles.Text}></TextInput>
              </View>
              <View Style={styles.Inputs}>
                <Text style={styles.placeholder}>
                  Mobile No.{' '}
                  {mobileError ? (
                    <Text style={{color: 'red'}}>*</Text>
                  ) : (
                    <Text style={{color: 'red'}}>*</Text>
                  )}
                </Text>
                <TextInput
                  required
                  maxLength={10}
                  keyboardType={'numeric'}
                  value={data.mobile}
                  onChangeText={val =>
                    setData({...data, mobile: val}, setMobileError(true))
                  }
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
                  required
                  value={data.email}
                  onChangeText={val =>
                    setData({...data, email: val}, setEmailError(true))
                  }
                  style={styles.Text}></TextInput>
              </View>
              <View Style={styles.Inputs}>
                <Text style={styles.placeholder}>Library Details</Text>
                <TextInput
                  textAlignVertical="top"
                  multiline={true}
                  value={data.libDetails}
                  onChangeText={val => setData({...data, libDetails: val})}
                  style={styles.remark}></TextInput>
              </View>
              <View Style={styles.Inputs}>
                <Text style={styles.placeholder}>Remark</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={10}
                  value={data.Text}
                  textAlignVertical="top"
                  onChangeText={val => setData({...data, remark: val})}
                  style={styles.remark}></TextInput>
              </View>
              <View style={{borderRadius: 7, backgroundColor: 'transparent'}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#1aab0f',
                    width: '89.8%',
                    color: '#4a3bd1',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 45,
                    borderColor: 'green',
                    borderRadius: 7,
                    marginTop: 10,
                    marginBottom: 0,
                    marginTop: 30,
                    marginLeft: 6,
                    borderWidth: 0.3,
                  }}
                  onPress={saveData}>
                  <Text style={{color: '#fff', margin: 5}}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default NewSchedule;

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
    width: '95%',
    height: 30,
    color: '#999',
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
    width: '90%',
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingLeft:10,
    borderColor: '#999',
  },
  remark: {
    marginTop: '2%',
    color: '#000',
    marginLeft: 5,
    fontSize: 15,
    paddingLeft:10,
    width: '90%',
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
