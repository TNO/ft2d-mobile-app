import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View,
         TextInput,
         Picker,
         KeyboardAvoidingView,
         TouchableOpacity,
         Keyboard,
         YellowBox
        //  Platform
        } from 'react-native';


// Use statistics.js to get the distribution 
// then plot 

export default class App extends Component {

  state = {
    unit: 'mmol/L',
    glucoseLevel: 10.0,
    diabeticStatus: 'healthy',
    dataMean: null, 
    dataStd: null, 
    dataSkew: null, 
    plotData: {
      y: Array.from({length: 100}, ()=> Math.random()),
      type: 'box'
    },
    plotState: {
      visibility: 'none'
    }
  }

  onPress = () => {
    this.getMean();
    this.getStd();
    this.getSkew();
    if(this.state.plotState.visibility == 'none'){
      this.setState({plotState:{ visibility:'block'}})
    } else {
      this.setState({plotState:{ visibility: 'none'}})
    }
  }

  /*
  * This method gets the statistics frorm EASME server
  * name is a pandas.DataFrame method 
  * axis is the axis that method is applied to
  */
  getRequest = (name: String, axis: Number): Promise<Response> => {
    return  fetch(`https://dashin.eu/easme/api/calculation?study_code=Diclofenac&arg=${name}&axis=${axis}`,{
      method: 'GET',
      headers: {
        authorization: 'Token ***REMOVED***',
        mode: 'cors'
      }
    })
  }

  getMean = () => {
    this.getRequest('mean', 0)
    .then((response) => response.json())
    .then((responseJson) => this.setState({ dataMean: responseJson}))
    .catch((err) => console.log(err))
  }

  getStd = () => {
    this.getRequest('std', 0)
    .then((response) => response.json())
    .then((responseJson) => this.setState({ dataStd: responseJson}))
    .catch((err) => console.log(err))
  }

  getSkew = () => {
    this.getRequest('skew',0)
    .then((response) => response.json())
    .then((responseJson) => this.setState({ dataStd: responseJson}))
    .catch((err) => console.log(err))
  }

  render(){
    return(
      <KeyboardAvoidingView 
        behavior="padding" 
        style={{ backgroundColor: 'white', flex: 1, flexDirection: 'column' }}
        keyboardVerticalOffset={-30}>
            <View style={{ backgroundColor: 'steelblue',width:'100%',height:'50%', flex: 1, flexDirection: 'row' }}>
              <View style={{ backgroundColor: 'grey', flex:1 }}>
                <View style={{ width: 30, height: 100, backgroundColor:'red', marginLeft: '50%', opacity: '30%', display: this.state.plotState.visibility }}></View>
              </View>
              <View style={{ backgroundColor: 'orange', flex:1 }}>
                <View style={{ flex:1 }}>
                  
                </View>
              </View>
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


