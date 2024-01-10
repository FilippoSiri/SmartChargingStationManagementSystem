import { StyleSheet } from 'react-native';

export default style = StyleSheet.create({
  main_view: {
    margin: 16,
  },
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    height: '15%',
    backgroundColor: '#fff',
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  textInput: {
    height: 40,
    width: '60%',
    marginRight: 12,
    paddingLeft: 5,
    borderWidth: 1,
  },
  map: {
    width: '100%',
    height: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
