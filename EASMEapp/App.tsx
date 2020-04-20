import Svg, { Circle, Rect, Line } from 'react-native-svg';
import * as S from 'react-native-svg';
import React, { Component } from 'react';
import { StyleSheet, 
         Text, 
         View,
         TextInput,
         Picker,
         KeyboardAvoidingView,
         TouchableOpacity,
         Keyboard,
        //  YellowBox
        } from 'react-native';


export default class App extends Component {

  state = {
    unit: 'mmol/L',
    glucoseLevel: null,
    insulinLevel: null,
    diabeticStatus: 'healthy',
    plot: {
      data: {
        glucose : {
            0.1: null,
            0.25: null,
            0.5: null, 
            0.75: null, 
            0.9: null, 
            min: null, 
            max: null
          },
        insulin: {
            0.1: null,
            0.25: null,
            0.5: null, 
            0.75: null, 
            0.9: null, 
            min: null, 
            max: null      
        },
      },
        show: false,
        x: null, 
        y: null, 
        width: null, 
        height: null
      },
    ml: null
    }
  

  componentDidMount(){
    this.getGlucoseData();
    console.log(this.state.plot.data);
  }

  onPress = () => {
    this.getRegressionResults();
    this.setState({plot:{
      ...this.state.plot,
      show: true}});
      // console.log(this.state.plot.data);

  }

  /*
  * This method gets the statistics frorm EASME server
  * name is a pandas.DataFrame method 
  * axis is the axis that method is applied to
  */
  getRequest = (args: Object): Promise<Response> => {
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

  getRegressionResults = () => {
    this.getRequest({
      study_code: 'Diclofenac',
      arg: 'ml',
      X: 'Glu0',
      y: 'Ins0',
      method: 'linear_regression'
    })
    .then((response) => response.json())
    .then((resJson) => this.setState({
      ...this.state,
      ml: resJson
    }))
    .catch((err) => console.log(err))
    console.log(this.state.ml);
  }

  getGlucoseData = () => {

    this.getRequest({arg: 'quantile', q: 0.1})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: { 
        data:{
          glucose: {
            ...this.state.plot.data.glucose,
            0.1: resJson.Glu0
          },
          insulin:{
            ...this.state.plot.data.insulin,
            0.1: resJson.Ins0
          }
        }}
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'quantile', q: 0.25})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: { 
        data:{
          glucose: {
            ...this.state.plot.data.glucose,
            0.25: resJson.Glu0
          },
          insulin:{
            ...this.state.plot.data.insulin,
            0.25: resJson.Ins0
          }
        }}
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'quantile', q: 0.5})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: { 
        data:{
          glucose: {
            ...this.state.plot.data.glucose,
            0.5: resJson.Glu0
          },
          insulin:{
            ...this.state.plot.data.insulin,
            0.5: resJson.Ins0
          }
        }}
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'quantile', q: 0.75})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: { 
        data:{
          glucose: {
            ...this.state.plot.data.glucose,
            0.75: resJson.Glu0
          },
          insulin:{
            ...this.state.plot.data.insulin,
            0.75: resJson.Ins0
          }
        }}
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'quantile', q: 0.9})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: { 
        data:{
          glucose: {
            ...this.state.plot.data.glucose,
            0.9: resJson.Glu0
          },
          insulin:{
            ...this.state.plot.data.insulin,
            0.9: resJson.Ins0
          }
        }}
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'min'})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: { 
        data:{
          glucose: {
            ...this.state.plot.data.glucose,
            min: 65
          },
          insulin:{
            ...this.state.plot.data.insulin,
            min: resJson.Ins0
          }
        }}
    })).catch((err) => console.log(err));

    this.getRequest({arg: 'max'})
    .then((response) => response.json())
    .then((resJson) => this.setState({
      plot: { 
        data:{
          glucose: {
            ...this.state.plot.data.glucose,
            max: resJson.Glu0
          },
          insulin:{
            ...this.state.plot.data.insulin,
            max: resJson.Ins0
          }
        }}
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

  }

  generateCoordTransformer(minReal,maxReal,minScale,maxScale){
    return (x) => {
      return ((1-((x-minReal)/(maxReal-minReal)))*(maxScale-minScale) + minScale);
    }
  }

  linspace(min,max,n){
    let d = (max - min)/n;
    let arr = [];
    for(let i = 0; i < n; i++){
      arr.push(min + d*i);
    }
    return arr;
  }

  _createYTicks(x: number,n: number,type: string ='glucose'){
    try{
      let minVal = this.state.plot.data[type].min,
          maxVal  =this.state.plot.data[type].max;
      console.log('minvals', minVal);
      let yr = this.linspace(minVal, maxVal, n);
      let transformer = this.generateCoordTransformer(minVal, maxVal, 40, 250);
      let yp = yr.map((v) => transformer(v));
      let ticks = [];
      for(let i = 0; i < n; i++){
        ticks.push(<S.Text x={x-5} y={yp[i]+4} textAnchor='end'>{`${yr[i].toFixed(1)}`}</S.Text>);
        ticks.push(<Line 
          x1={x}
          y1={yp[i]}
          x2={x-5}
          y2={yp[i]}
          stroke='black'
          />);
      }
      ticks.push(<Line 
        x1={x}
        y1={yp[0]}
        x2={x}
        y2={yp[yp.length-1]}
        stroke='black'/>);
      return ticks;
    } catch(error) {
      console.log(error);
      return null;
    }
  }
  

  createBox(x){
    let transformer = this.generateCoordTransformer(this.state.plot.data.glucose.min,
      this.state.plot.data.glucose.max, 40, 250);
    let y1 = transformer(this.state.plot.data.glucose["0.75"]);
    let y2 = transformer(this.state.plot.data.glucose["0.25"]);
    return(<Rect 
              x={x}
              y={y2}
              height={y1-y2}
              width={80}
              opacity={0.4}/>)
  }

  _createBox(x: number, type: string='glucose'){
    try{
      let transformer = this.generateCoordTransformer(
        this.state.plot.data[type].min,
        this.state.plot.data[type].max,
        40, 250
      );
      let y1 = transformer(this.state.plot.data[type]['0.75']);
      let y2 = transformer(this.state.plot.data[type]['0.25']);
      return(<Rect 
        x={x}
        y={y2}
        height={y1-y2}
        width={80}
        opacity={0.4}/>);
    } catch(error) {
      console.log(error);
      return null;
    }
  }

  createIQRLine(x){
    let transformer = this.generateCoordTransformer(this.state.plot.data.glucose.min,
      this.state.plot.data.glucose.max, 40, 250);
    let iqr = this.state.plot.data.glucose[0.75] - this.state.plot.data.glucose[0.25];
    let vmin = this.state.plot.data.glucose[0.25] - 1.5*iqr;
    let vmax = this.state.plot.data.glucose[0.75] + 1.5*iqr; 
    let y1 = transformer(vmin);
    let y2 = transformer(vmax);
    console.log(vmin);
    console.log(vmax);
    return(<Rect 
      x={x}
      y={y2}
      height={y1-y2}
      width={10}
      opacity={0.4}/>) 
  }

  _createIQRLine(x:number,type='glucose'){
    try{
      let transformer = this.generateCoordTransformer(this.state.plot.data[type].min,
        this.state.plot.data[type].max, 40, 250);
        let iqr = this.state.plot.data[type][0.75] - this.state.plot.data[type][0.25];
        let vmin = this.state.plot.data[type][0.25] - 1.5*iqr;
        let vmax = this.state.plot.data[type][0.75] + 1.5*iqr; 
        let y1 = transformer(vmin);
        let y2 = transformer(vmax);
        return(<Rect 
          x={x}
          y={y2}
          height={y1-y2}
          width={10}
          opacity={0.4}/>);    
    } catch(error) {
      console.log(error);
      return null;
    }
  }

  _createMedianLine(x:number, m: number, type: string='glucose'){
    try{
      let transformer = this.generateCoordTransformer(
        this.state.plot.data[type].min,
        this.state.plot.data[type].max, 
        40, 250
      ); 
      let y = transformer(this.state.plot.data[type]['0.5']);
      return(<Line
        x1={x}
        y1={y}
        x2={x+m}
        y2={y}
        strokeWidth={2}
        stroke='black'/>);
    } catch(error) {
      console.log(error);
      return null; 
    }
  }

  createGlucoseLevelIndicator(x,m){
    let transformer = this.generateCoordTransformer(this.state.plot.data.glucose.min,
      this.state.plot.data.glucose.max, 40, 250);
    if(this.state.glucoseLevel != null){
      let y = transformer(this.state.glucoseLevel);
      return(<Line
        x1={x}
        y1={y}
        x2={x+m}
        y2={y}
        strokeWidth={3}
        stroke='red'/>); 
    } else {
      return null;
    }
    
  }

  _createLevelIndicator(x: number, m: number, type: string='glucose'){
    try{
      let transformer = this.generateCoordTransformer(
        this.state.plot.data[type].min,
        this.state.plot.data[type].max, 
        40, 250
      );
      let level; 
      if(type == 'glucose' && this.state.glucoseLevel != null && 
      this.state.glucoseLevel >= this.state.plot.data.glucose.min && 
      this.state.glucoseLevel <= this.state.plot.data.glucose.max){
        level = this.state.glucoseLevel;
        let y = transformer(level);
        return(<Line
          x1={x}
          y1={y}
          x2={x+m}
          y2={y}
          strokeWidth={3}
          stroke='red'/>); 
      }
      if(type == 'insulin'){
        let a = this.state.ml.m,
            b = this.state.ml.n;
        console.log("a: " + a);
        console.log("b: " + b);
        level = a*this.state.glucoseLevel + b;
        let y = transformer(level);
        return(<Line
          x1={x}
          y1={y}
          x2={x+m}
          y2={y}
          strokeWidth={3}
          stroke='red'/>); 
      } else {
        return null;
      }

    } catch(error) {
      console.log(error);
      return null;
    }
  }

  


  render(){
    
    return(
      <KeyboardAvoidingView 
        behavior="padding" 
        style={{ backgroundColor: 'white', flex: 1, flexDirection: 'column' }}
        keyboardVerticalOffset={-30}>
            <View style={{ backgroundColor: 'none',width:'100%',height:'50%', flex: 1, flexDirection: 'row' }}>
              <View style={{ backgroundColor: 'none', flex:1,height:'100%' }}
                    onLayout={(event) => { this.getPlotCanvasDimensions(event.nativeEvent.layout) }}>
                { this.state.plot.show ? (
                    <Svg 
                      style={{backgroundColor: 'white', flex:1}}
                    >
                      {this._createYTicks(50,6)}
                      {this._createBox(60)}
                      {this._createIQRLine(60)}
                      {this._createMedianLine(60,95)}
                      {this._createLevelIndicator(60,95)}

                    </Svg>

                ) : null }
              </View>
              <View style={{ backgroundColor: 'none', flex:1 }}>
                <View style={{ flex:1, height: '100%' }}>
                  { this.state.plot.show ? (
                    <Svg
                    style={{backgroundColor: 'white', flex: 1}}
                    onLayout={(event) => { this.getPlotCanvasDimensions(event.nativeEvent.layout) }}
                    >
                      {this._createYTicks(50,6,'insulin')}
                      {this._createBox(60,'insulin')}
                      {this._createIQRLine(60,'insulin')}
                      {this._createMedianLine(60,95,'insulin')}
                      {this._createLevelIndicator(60,95,'insulin')}

                    </Svg>
                  ) : null}
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
                    <Picker.Item label="not diabetic" value="not diabetic"></Picker.Item>
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
                              this.setState({glucoseLevel: level.length == 0 ? null : Number.parseFloat(level)});
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
