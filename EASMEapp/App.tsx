import Svg, { Circle, Rect, Line } from 'react-native-svg';
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
        } from 'react-native';


export default class App extends Component {

  state = {
    unit: 'mmol/L',
    glucoseLevel: 10.0,
    diabeticStatus: 'healthy',
    plot: {
      data: {
        0.1: null,
        0.25: null,
        0.5: null, 
        0.75: null, 
        0.9: null, 
        min: null, 
        max: null
      },
      show: false,
      x: null, 
      y: null, 
      width: null, 
      height: null
    }
  }

  componentDidMount(){
    this.getGlucoseData();
  }

  onPress = () => {
    this.setState({plot:{
      ...this.state.plot,
      show: true}});
    console.log(this.state.plot.data);

  }

  /*
  * This method gets the statistics frorm EASME server
  * name is a pandas.DataFrame method 
  * axis is the axis that method is applied to
  */
  private getRequest = (args: Object): Promise<Response> => {
    let requestArguments = [];
    for(let [key,value] of Object.entries(args)){
      requestArguments.push(`${key}=${value}`);
    }
    let allArguments = requestArguments.join("&");
    return  fetch(`https://dashin.eu/easme/api/calculation?study_code=Diclofenac&${allArguments}`,{
      method: 'GET',
      headers: {
        authorization: 'Token ***REMOVED***',
      }
    })
  }

  private getGlucoseData = () => {

    this.getRequest({arg: 'quantile', q: 0.1})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: {
        data: {
          ...this.state.plot.data,
          0.1: resJson.Glu0
        }
      }
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'quantile', q: 0.25})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: {
        data: {
          ...this.state.plot.data,
          0.25: resJson.Glu0
        }
      }
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'quantile', q: 0.5})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: {
        data: {
          ...this.state.plot.data,
          0.5: resJson.Glu0
        }
      }
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'quantile', q: 0.75})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: {
        data: {
          ...this.state.plot.data,
          0.75: resJson.Glu0
        }
      }
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'quantile', q: 0.9})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: {
        data: {
          ...this.state.plot.data,
          0.9: resJson.Glu0
        }
      }
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'min'})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: {
        data: {
          ...this.state.plot.data, 
          min: resJson.Glu0
        }
      }
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'max'})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: {
        data: {
          ...this.state.plot.data, 
          max: resJson.Glu0
        }
      }
    }))
    .then(() => console.log(this.state.plot.data))
    .catch((err) => console.log(err));

  }

  getPlotCanvasDimensions = (layout) => {
    console.log('on layout called');
    const {x, y, width, height} = layout;
    this.setState({plot: {
        ...this.state.plot,
        x: x,
        y: y,
        width: width,
        height: height
    }});
    console.log(this.state.plot);

    // const {x, y, width, height} = layout;
    // this.setState({plot: {
    //     ...this.state.plot,
    //     x: x,
    //     y: y,
    //     width: width,
    //     height: height
    // }});
    
  }

  drawLines(){
    return [1,2,3,4,5,6,7,8,9,10].map((i)=>{
      return(
        <Line x1={i*10} y1={0} x2={i*10} y2={20} stroke='black'></Line>
      )
    })
  }
  
  render(){
    return(
      <KeyboardAvoidingView 
        behavior="padding" 
        style={{ backgroundColor: 'white', flex: 1, flexDirection: 'column' }}
        keyboardVerticalOffset={-30}>
            <View style={{ backgroundColor: 'steelblue',width:'100%',height:'50%', flex: 1, flexDirection: 'row' }}>
              <View style={{ backgroundColor: 'grey', flex:1,height:'100%' }}
                    onLayout={(event) => { this.getPlotCanvasDimensions(event.nativeEvent.layout) }}>
                { this.state.plot.show ? (
                    <Svg 
                      style={{backgroundColor: 'white', flex:1}}
                    >
                      {this.drawLines()}
                      {/* <Line x1={10} y1={0} x2={10} y2={20} stroke="black"></Line> */}
                    </Svg>

                ) : null }


                
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
