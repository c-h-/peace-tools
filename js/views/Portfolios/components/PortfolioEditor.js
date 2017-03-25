import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
} from 'react-native';
import {
  connect,
} from 'react-redux';
import {
  Popover,
  Overlay,
} from '@blueprintjs/core';
import {
  Column,
  EditableCell,
  Cell,
  Table,
} from '@blueprintjs/table';

// add blueprint table css
import '../../../../node_modules/@blueprintjs/table/dist/table.css';
import styles from '../styles';

import {
  addTransaction,
  editTransaction,
  removeTransaction,
} from '../actions';
import AddTransactionForm from './AddTransactionForm';

import defs from '../../../constants/assetDefs.json';
import transStructure from '../../../constants/transactionStructure.json';

const assetDefs = defs.defs;

class PortfolioEditor extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    id: PropTypes.number,
    transactions: PropTypes.array,
  }
  static shiftColumns(colIndex) {
    // shifts column index to match transaction data structure
    return colIndex + 2;
  }
  state = {
    isOpen: false,
    selectedTransactions: [],
  }
  componentWillMount() {
    this.updateTransactions(this.props);
  }
  // pre-filter transactions so it's faster to access them in the component
  componentWillReceiveProps(nextProps) {
    this.updateTransactions(nextProps);
  }
  updateTransactions = (props) => {
    const {
      transactions,
      id,
    } = props;
    this.setState({
      selectedTransactions: transactions.filter(trans => trans[transStructure.PID] === id),
    });
  }
  addRow = (data) => {
    const {
      dispatch,
    } = this.props;
    dispatch(addTransaction(data));
  }
  openOverlay = () => {
    this.setState({
      isOpen: true,
    });
  }
  closeOverlay = () => {
    this.setState({
      isOpen: false,
    });
  }
  editCell = (rowId, col) => {
    return (edit) => {
      const {
        dispatch,
      } = this.props;
      // adjust column since the data in the store has a 0th column
      dispatch(editTransaction(rowId, PortfolioEditor.shiftColumns(col), edit));
    };
  }
  renderDeleteButton = (rowIndex) => {
    const deleteHandler = () => {
      const {
        dispatch,
      } = this.props;
      const {
        selectedTransactions,
      } = this.state;
      dispatch(removeTransaction(selectedTransactions[rowIndex][transStructure.ID]));
    };
    return (
      <Cell style={{ padding: 0 }}>
        <Popover
          content={(
            <View className="pt-card">
              <View
                accessibilityRole="button"
                className="pt-button pt-intent-danger"
                onClick={deleteHandler}
              >
                Confirm
              </View>
            </View>
          )}
        >
          <View
            accessibilityRole="button"
            className="pt-button pt-intent-danger"
            style={{
              width: 150,
              minHeight: 20,
              lineHeight: 20,
            }}
          >
            Delete
          </View>
        </Popover>
      </Cell>
    );
  }
  renderCell = (rowIndex, columnIndex) => {
    const {
      selectedTransactions,
    } = this.state;
    let value = selectedTransactions[rowIndex][PortfolioEditor.shiftColumns(columnIndex)];
    switch (PortfolioEditor.shiftColumns(columnIndex)) {
      case transStructure.TYPE: {
        // asset type
        value = assetDefs.find(asset => asset.enum === parseInt(value, 10)).name;
        break;
      }
      case transStructure.T_TYPE: {
        // transaction type
        value = assetDefs
          .find(asset => asset.enum === parseInt(
            selectedTransactions[rowIndex][transStructure.TYPE],
            10
          ))
          .t_types.find(t_type => t_type.enum === parseInt(value, 10)).name;
        break;
      }
      case transStructure.DATE: {
        value = new Date(value).toString();
        break;
      }
      case transStructure.AMOUNT: {
        value = value || 0;
        break;
      }
      case transStructure.NOTES:
      case transStructure.SYMBOL:
      default:
        break;
    }
    return (
      <EditableCell
        onConfirm={this.editCell(selectedTransactions[rowIndex][transStructure.ID], columnIndex)}
        value={typeof value !== 'object' && typeof value !== 'undefined' ? value : ''}
      />
    );
  }
  render() {
    const {
      isOpen,
      selectedTransactions,
    } = this.state;
    const {
      id,
    } = this.props;
    return (
      <View className="pt-card pt-elevation-1">
        <Table numRows={selectedTransactions.length}>
          <Column
            name="Asset Type"
            renderCell={this.renderCell}
          />
          <Column
            name="Symbol"
            renderCell={this.renderCell}
          />
          <Column
            name="Transaction Type"
            renderCell={this.renderCell}
          />
          <Column
            name="Date"
            renderCell={this.renderCell}
          />
          <Column
            name="Price/Amount"
            renderCell={this.renderCell}
          />
          <Column
            name="Shares"
            renderCell={this.renderCell}
          />
          <Column
            name="Notes"
            renderCell={this.renderCell}
          />
          <Column
            name="Action"
            renderCell={this.renderDeleteButton}
          />
        </Table>
        <View
          className="pt-button-group"
          style={styles.buttonContainer}
        >
          <View
            accessibilityRole="button"
            className="pt-button pt-icon-add"
            onClick={this.openOverlay}
          >
            Add Transaction
          </View>
        </View>
        <Overlay
          isOpen={isOpen}
          onClose={this.closeOverlay}
        >
          <AddTransactionForm
            portfolioId={id}
            onSave={this.addRow}
            onClose={this.closeOverlay}
          />
        </Overlay>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    rows: state.portfolios.rows || [],
    transactions: state.portfolios.transactions || [],
  };
}

export default connect(mapStateToProps)(PortfolioEditor);
