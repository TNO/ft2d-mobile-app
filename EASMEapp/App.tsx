import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View,
         TextInput,
         Picker,
         KeyboardAvoidingView,
         TouchableOpacity,
         Keyboard,
        //  Platform
        } from 'react-native';
import { ToastAndroid } from 'react-native';
import { YellowBox }  from 'react-native';




export default class App extends Component {

  state = {
    unit: 'mmol/L',
    glucoseLevel: 10.0,
    diabeticStatus: 'healthy',
    dataMean: null,
    dataStd: null,
    plotData: {
      y: Array.from({length: 100}, ()=> Math.random()),
      type: 'box'
    }
  }

  onPress = () => {
    
    this.getData();
    console.log(this.state.dataMean);
    // ToastAndroid.show(this.state.dataMean,ToastAndroid.SHORT);
  }

  

  getData = () => {
    fetch('https://dashin.eu/easme/api/calculation?study_code=Diclofenac&arg=mean&axis=0',{
      method: 'GET',
      headers: {
        authorization: 'Token ***REMOVED***'
      }
    })
    .then((response) => response.json())
    .then((responseJson) => this.setState({dataMean: responseJson}))
    .catch((error) => console.log(error));
  }

  render(){
    return(
      <KeyboardAvoidingView 
        behavior="padding" 
        style={{ backgroundColor: 'white', flex: 1, flexDirection: 'column' }}
        keyboardVerticalOffset={-30}>
            <View style={{ backgroundColor: 'steelblue',width:'100%',height:'50%'}}>
              <WebView source={{uri: 'https://www.google.com'}}></WebView>
            </View>
            <View style={{ backgroundColor: 'pink', width: '100%',height:'10%' }}>
              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 1, justifyContent:'center',backgroundColor:'white' }}>
                  <Text style={{ fontSize: 20, textAlign:'center'}}>I am</Text>
                </View>
                <View style={{ flex: 1, justifyContent:'center', borderWidth:3 }}>
                <Picker
                  selectedValue={this.state.diabeticStatus}
                  onValueChange={(val) => {this.setState({diabeticStatus:val})}}
                  itemStyle={{ fontSize: 25, alignItems: 'center'}}>
                    <Picker.Item label="healthy" value="healthy"></Picker.Item>
                    <Picker.Item label="diabetic" value="diabetic"></Picker.Item>
                  </Picker>
                </View>

              </View>
            </View>
            <View style={{ backgroundColor: 'white', width: '100%', height: '10%'}}>
              <View style={{ flex: 1, justifyContent: 'center'}}>
                <Text style={{  fontSize: 20, marginLeft: '2%' }}>
                  My blood glucose level:
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: 'grey', width: '100%', height: '15%'}}>
              <View style={{ flex: 1,flexDirection: 'row' }}>
                <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', borderWidth:3, borderLeftWidth:0 }}>
                  <TextInput style={{ fontSize: 35, textAlign: 'center'}} 
                            keyboardType='decimal-pad'
                            onChangeText={(level) => {
                              this.setState({glucoseLevel: Number.parseFloat(level)});
                              }}
                              onEndEditing={() => Keyboard.dismiss()}>
                  </TextInput>
                </View>
                <View style={{ flex: 1, backgroundColor: 'orange', justifyContent: 'center',
                              borderWidth:3 ,borderLeftWidth:0, borderRightWidth:0 }}>
                  <Picker 
                    selectedValue={this.state.unit}
                    onValueChange={(u) => this.setState({unit: u})}>
                    <Picker.Item label="mmol/L" value="mmol/L" />
                    <Picker.Item label="mg/dL" value="mg/dL" />
                  </Picker>
                </View>
              </View>
          </View>
            <View style={{ backgroundColor: 'pink', width:'100%', height: '15%' }}>
              <View style={{ flex: 1, justifyContent:'center'}}>
                <TouchableOpacity
                  onPress={this.onPress}>
                  <Text style={{ fontSize: 40, textAlign: 'center'}}>Calculate</Text>
                </TouchableOpacity>
                
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
