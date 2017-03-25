import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  tabContents: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popover: {
    maxWidth: 300,
    padding: 10,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tag: {
    marginBottom: 5,
    marginRight: 5,
  },
  headline: {
    marginVertical: 4,
  },
  headlines: {
    maxHeight: 300,
    overflowY: 'auto',
  },
  StatBlocks: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  StatBlock: {
    width: 400,
    marginHorizontal: 10,
    marginTop: 20,
  },
  StatBlockHeader: {
    fontSize: 22,
  },
  StatBlockData: {
    width: '50%',
    marginVertical: 10,
  },
  StatBlockMetric: {
    fontSize: 16,
  },
  emptyContainer: {
    marginVertical: 40,
  },
  option: {
    flexDirection: 'row',
    width: '100%',
    flexGrow: 1,
  },
  optionLabel: {
    fontWeight: 'bold',
    flexGrow: 1,
  },
  optionName: {
    color: '#95a5a6',
    fontWeight: 'normal',
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
    height: 35,
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
    alignItems: 'flex-end',
    padding: 15,
    height: 'auto',
  },
  toolbarChild: {
    marginRight: 30,
  },
  SelectContainer: {
    flexGrow: 1,
  },
});

export default styles;
