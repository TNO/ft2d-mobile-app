import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View,
         Button,
         TextInput,
         Picker,
         KeyboardAvoidingView,
         
        } from 'react-native';
import {ToastAndroid} from 'react-native';
import * as Font from 'expo-font';

export default class App extends Component {

  state = {
    unit: 'mmol/L',
    glucoseLevel: 10.0,
    diabeticStatus: 'healthy'
  }

  render(){
    return(
      <KeyboardAvoidingView 
        behavior="padding" style={{ backgroundColor: 'powderblue', flex: 1}}>

            <View style={{ backgroundColor: 'white',width:'100%',height:'50%'}}/>
            <View style={{ backgroundColor: 'pink', width: '100%',height:'10%' }}>
              <View style={{ flex: 1 }}>

              </View>
            </View>
            <View style={{ backgroundColor: 'yellow', width: '100%', height: '10%'}}>
              <View style={{ flex: 1, justifyContent: 'center'}}>
                <Text style={{  fontSize: 20, marginLeft: '2%' }}>
                  Glucose level input:
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: 'grey', width: '100%', height: '20%'}}>
            <View style={{ flex: 1,flexDirection: 'row' }}>
              <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
                <TextInput style={{ fontSize: 35, textAlign: 'center'}} 
                          keyboardType='decimal-pad'
                          onChangeText={(level) => {
                            this.setState({glucoseLevel: Number.parseFloat(level)});
                            //  ToastAndroid.show(`Glucose level is ${this.state.glucoseLevel}`,ToastAndroid.SHORT);
                            }}>
                </TextInput>
              </View>
              <View style={{ flex: 1, backgroundColor: 'orange', justifyContent: 'center' }}>
                <Picker 
                  
                  selectedValue={this.state.unit}
                  onValueChange={(u) => this.setState({unit: u})}>
                  <Picker.Item label="mmol/L" value="mmol/L" />
                  <Picker.Item label="mg/dL" value="mg/dL" />
                </Picker>
              </View>
            </View>
          </View>

      </KeyboardAvoidingView>
    )
  }


}

const styles = StyleSheet.create({

  mainView:{ 
    backgroundColor: 'powderblue',
    flex:1,
    flexDirection: 'column',
    
  }

});
