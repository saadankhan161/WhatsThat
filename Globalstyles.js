import { StyleSheet } from 'react-native';
// contains some styles used more than once
const globalstyles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
backgroundColor: 'lightgrey',
},
box: {
backgroundColor: 'darkgrey',
borderRadius: 5,
padding: 20,
marginBottom: 10,
width: '80%',
alignItems: 'center',
},  
});

export default globalstyles;