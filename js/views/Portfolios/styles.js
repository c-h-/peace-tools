import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  tabContents: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
    marginBottom: 10,
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
  OverlayContainer: {
    zIndex: 20,
    width: '80vw',
    maxHeight: '80vh',
    overflow: 'auto',
    marginTop: '10vh',
    marginHorizontal: 'auto',
  },
});

export default styles;
