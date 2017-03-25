import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#EBF1F5',
  },
  buttonContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
    flexDirection: 'row',
  },
  button: {
    // marginBottom: 10,
  },
  Text: {
    marginBottom: 10,
  },
  TextInput: {
    borderColor: '#999',
    borderWidth: 1,
    borderStyle: 'solid',
    marginBottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  toolbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  SelectContainer: {
    marginRight: 10,
    flexGrow: 1,
  },
});

export default styles;
