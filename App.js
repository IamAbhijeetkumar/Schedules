import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Schedules from './component/Schedules';
import EditSchedule from './component/EditSchedule';
import NewSchedule from './component/NewSchedule';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Schedules">
        <Stack.Screen name="NewSchedule" component={NewSchedule} />
        <Stack.Screen name="EditSchedule" component={EditSchedule} />
        <Stack.Screen
          name="Schedules"
          component={Schedules}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#98DBC6',
  },
  buttonStyle: {
    backgroundColor: '#F18D9E',
    padding: 10,
    marginTop: 32,
    minWidth: 250,
    borderRadius: 5,
  },
});

export default App;
