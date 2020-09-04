# FT2D Demonstrator Mobile App 

This mobile app is developed with the purpose demonstrating the capabilities of [FT2D](https://dashin.eu/ft2d) Big Data and B2B Web platform. It takes the blood glucose level measurement from the user and shows where the user is within the scale. Also, it estimates the insulin level by requesting a linear regression from FT2D platform. 

<img src="https://raw.githubusercontent.com/TNO/ft2d-mobile-app/master/Screenshot_20200602-134603_Expo.png" width=30%>

## Installation and testing 
App is written in Typescript using React Native. You need to have Node.js (> 10) and npm installed. First install Typescript and Expo client (for React Native) 
```
npm install -g typescript 
npm install -g expo-cli 
```
Then run the following to install the dependencies
```
npm install
```
Finally run the Expo.
```
expo start
```
When Expo starts, it will show a web page which will allow you to test the app either on browser or a mobile device. To test the app in mobile device, you need to have Android SDK installed. 

In addition you need to replace the `***REMOVED***` string with your API token you obtained from [FT2D](https://dashin.eu/ft2d) in `App.tsx` file (see below).
```typescript
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
```
