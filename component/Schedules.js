import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  PermissionsAndroid,
  View,
  ToastAndroid,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';

const Schedules = ({navigation}) => {
  const isFocused = useIsFocused();
  // const [content, setContent] = useState();
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loader, setLoader] = useState(false);
  const [disable, setDisable] = useState(false);
  const [filePath, setFilePath] = useState('');

  useEffect(() => {
    getData();
  }, [isFocused]);

  const Deleteone = () => {
    ToastAndroid.show('Deleted !', ToastAndroid.SHORT);
  };
  const DeleteAll = () => {
    ToastAndroid.show('All Deleted !', ToastAndroid.SHORT);
  };

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.show('File Saved Successfully !', ToastAndroid.SHORT);
  };

  const clearStorage = async () => {
    Alert.alert('Are your sure ? ', 'Want To Delete All', [
      {
        text: 'Confirm',
        onPress: async () => {
          await AsyncStorage.clear();
          DeleteAll();
          getData();
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  const getData = async () => {
    const value = JSON.parse(await AsyncStorage.getItem('DATA'));
    console.log('getItems', value);
    if (value === null || value === '' || value.length === 0) {
      setDisable(true);
      setData(value);
    } else {
      setDisable(false);
      setLoader(false);
      setData(value.reverse());
    }
  };

  const deleteme = async id => {
    console.log('cLicked on me');
    Alert.alert('Are your sure ?', 'Want To Delete', [
      {
        text: 'Confirm',
        onPress: async () => {
          // setLoader(true);
          const result = await AsyncStorage.getItem('DATA');
          let notes = [];
          if (result !== null) notes = JSON.parse(result);
          const newNotes = notes.filter(n => n.id !== id);
          await AsyncStorage.setItem('DATA', JSON.stringify(newNotes));
          Deleteone();
          getData();
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getData();
      setRefreshing(false);
    });
  }, []);

  var List =
    data === null
      ? []
      : data.map(i => {
          return ` 
          <div style="margin-Top:20px; padding-top:5px; padding-bottom:5px;background-color:white;width:700px;height:'auto';border:2px solid #045; display:inline-flex;">
          <ul>
      <li style=" font-size:20px; color:#000; width:'600px'; height:'auto'">Name<span style=" font-size:20px; color:#045;"> : ${i.name}<span></li>
      <li style=" font-size:20px; color:#000; width:'600px'; height:'auto'">Mobile<span style=" font-size:20px; color:#045;"> : ${i.mobile}<span></li>
      <li style=" font-size:20px; color:#000; width:'600px'; height:'auto'">Email<span style=" font-size:20px; color:#045;"> : ${i.email}<span></li>
      <li style=" font-size:20px; color:#000; width:'600px'; height:'auto'">Details<span style=" font-size:20px; color:#045;"> : ${i.libDetails}<span></li>
      <li style=" font-size:20px; color:#000; width:'600px'; height:'auto'">Remark<span style=" font-size:20px; color:#045;"> : ${i.remark}<span></li>
      <li style=" font-size:20px; color:#000; width:'600px'; height:'auto'">Date<span style=" font-size:20px; color:#045;"> : ${i.date}<span>
      </li>
       </ul>
      </div>
   `;
        });

  const fileName =
    new Date().toDateString() +
    ',' +
    new Date().getHours() +
    ':' +
    new Date().getMinutes() +
    ':' +
    new Date().getSeconds();

  const createPDF = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to Storage',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Granted');
        let options = {
          html: List.toString(),
          fileName: fileName,
          directory: 'documents',
          height: 1000,
          width: 612,
          base64: true,
        };
        let file = await RNHTMLtoPDF.convert(options);
        let filePath = RNFetchBlob.fs.dirs.DownloadDir + `s/${fileName}.pdf`;
        console.log(RNFetchBlob.fs.dirs.DocumentDir);
        RNFetchBlob.fs
          .writeFile(filePath, file.base64, 'base64')
          .then(response => {
            console.log('Success Log :', response);
          })
          .catch(errors => {
            console.log('Error Log :', errors);
          });
        showToastWithGravityAndOffset();
        console.log(file.filePath);
        setFilePath(file.filePath);
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <>
      <View
        style={{
          backgroundColor: '#fff',
          justifyContent: 'space-between',
          flexDirection: 'row',
          height: 50,
          borderRadius: 5,
          width: '99%',
          marginLeft:2,
          marginTop:2,
          elevation: 50,
          borderColor:'green',
          borderWidth:0.5,
        }}>
        <Text
          style={{
            color: '#000',
            fontSize: 24,
            marginLeft: 15,
            marginTop: 8,
            fontFamily: 'sans-serif',
          }}>
          Schedules
        </Text>
        <View
          style={{
            marginRight: -20,
            width: 200,
            height: 50,
            flexDirection: 'row',
          }}>
          {disable ? null : (
            <TouchableOpacity
              style={{
                backgroundColor: '#1aab0f',
                width: 80,
                paddingRight: 10,
                paddingLeft: 10,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                marginTop: 10,
                marginRight: 10,
                borderWidth: 0.5,
              }}
              disabled={disable}
              onPress={createPDF}>
              <Text style={{color: '#fff'}}>Save</Text>
            </TouchableOpacity>
          )}
          {disable ? null : (
            <TouchableOpacity
              style={{
                backgroundColor: '#b30e0e',
                width: 80,
                paddingRight: 10,
                paddingLeft: 10,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                marginTop: 10,
                marginRight: 10,
                borderWidth: 0.5,
              }}
              disabled={disable}
              onPress={clearStorage}>
              {disable ? null : <Text style={{color: '#fff'}}>Delete All</Text>}
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View
        style={{
          width: 50,
          height: 50,
          position: 'absolute',
          bottom: 50,
          right: 20,
          zIndex: 9999,
        }}>
        <TouchableOpacity
          style={[
            {
              elevation: 20,
              backgroundColor: '#1aab0f',
              width: 50,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              height: 50,
            },
            styles.shadowProp,
          ]}
          onPress={() => navigation.navigate('NewSchedule')}>
          <View
            style={{
              height: '90%',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                color: '#fff',
                fontSize: 30,
                textAlign: 'center',
              }}>
              +
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {loader ? (
          <View style={{justifyContent: 'center', height: 600}}>
            <ActivityIndicator size={50} />
          </View>
        ) : (
          <View>
            {data === null || data.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  color: 'red',
                  alignItems: 'center',
                  marginTop: 200,
                }}>
                <Text style={{color: '#999', fontSize: 25}}>
                  Nothing To Show
                </Text>
                <Text style={{color: '#999', fontSize: 15, marginTop: 15}}>
                  Click On ➕ Button To Add New One{' '}
                </Text>
              </View>
            ) : (
              data.map((item, index) => {
                return (
                  <View
                    key={item.id}
                    style={[styles.container, styles.shadowProp]}>
                    <View key={item.id}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.bold}>Name</Text>
                        <Text style={styles.Data}>: {item.name}</Text>
                      </View>
                      <View style={{color: 'black', flexDirection: 'row'}}>
                        <Text style={styles.bold}>Mobile</Text>
                        <Text style={styles.Data}>: {item.mobile}</Text>
                      </View>
                      <View style={{color: 'black', flexDirection: 'row'}}>
                        <Text style={styles.bold}>Email</Text>
                        <Text style={styles.Data}>: {item.email}</Text>
                      </View>
                      <View style={{color: 'black', flexDirection: 'row'}}>
                        <Text style={styles.bold}>Details</Text>
                        <Text style={styles.Data}>: {item.libDetails}</Text>
                      </View>
                      <View style={{color: 'black', flexDirection: 'row'}}>
                        <Text style={styles.bold}>Remark</Text>
                        <Text style={styles.Data}>: {item.remark}</Text>
                      </View>
                      <View style={{color: 'black', flexDirection: 'row'}}>
                        <Text style={styles.bold}>Date</Text>
                        <Text style={styles.Data}>: {item.date}</Text>
                      </View>
                      <View style={[styles.button]}>
                        <TouchableOpacity
                          style={[styles.btn, styles.shadowProp]}
                          onPress={() =>
                            navigation.navigate('EditSchedule', {item})
                          }>
                          <AntDesign color="#1aab0f" name="edit" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.btn, styles.shadowProp]}
                          onPress={() => deleteme(item.id)}>
                          <AntDesign color="#b30e0e" name="delete" size={20} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Schedules;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: '2%',
    paddingLeft: '5%',
    marginTop: '2%',
    marginLeft: '2%',
    width: '96%',
    borderRadius: 10,
    borderWidth: 0.8,
    borderColor: 'green',
    height: 'auto',
    maxheight: 400,
    backgroundColor: '#fff',
  },
  Data: {
    backgroundColor: '#fff',
    fontSize: 15,
    width: 250,
    color: '#045',
  },
  bold: {
    backgroundColor: '#fff',
    fontSize: 15,
    width: 60,
    marginRight: 5,
    marginRight: 0,
    color: '#045',
  },
  shadowProp: {
    elevation: 10,
    shadowColor: '#4357ba',
    shadowOffset: {width: -2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  button: {
    marginTop: 5,
    marginLeft: '-5.5%',
    width: '105.5%',
    height: 45,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'tranparent',
  },
  btn: {
    justifyContent: 'center',
    width: '50%',
    alignItems: 'center',
    height: '100%',
  },
});
