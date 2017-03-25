import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';
import {
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import {
  DatePicker,
} from '@blueprintjs/datetime';

import defs from '../../../constants/assetDefs.json';

import '../../../../node_modules/@blueprintjs/datetime/dist/blueprint-datetime.css';
import styles from '../styles';

const assetDefs = defs.defs;

const initState = {
  type: assetDefs[0].enum,
  t_type: 0,
  notes: null,
  date: null,
  amount: null,
  symbol: null,
  shares: null,
  isOpen: false,
};

class AddTransactionForm extends Component {
  static propTypes = {
    onSave: PropTypes.func,
    onClose: PropTypes.func,
    portfolioId: PropTypes.number,
  }
  state = initState
  handleChange = (key) => {
    return (e) => {
      this.setState({
        [key]: e.target.value,
      });
    };
  }
  handleDateChange = (date) => {
    this.closePopover();
    this.setState({
      date,
    });
  }
  handleClose = () => {
    const {
      onClose,
    } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
    this.resetState();
  }
  openPopover = () => {
    this.setState({
      isOpen: true,
    });
  }
  closePopover = () => {
    this.setState({
      isOpen: false,
    });
  }
  resetState = () => {
    const {
      type,
      t_type,
      date,
    } = this.state;
    this.setState({
      ...initState,
      t_type, // save these for easier multi-input
      type,
      date,
    });
  }
  saveTransaction = () => {
    const {
      onSave,
      portfolioId,
    } = this.props;
    if (typeof onSave === 'function') {
      onSave({
        ...this.state,
        pid: portfolioId,
      });
    }
    this.handleClose();
  }
  render() {
    const {
      notes,
      type,
      amount,
      date,
      isOpen,
      t_type,
      shares,
      symbol,
    } = this.state;
    const {
      onClose,
    } = this.props;
    const selectedAssetType = assetDefs.find(asset => asset.enum === parseInt(type, 10));
    return (
      <View
        className="pt-card"
        style={styles.OverlayContainer}
      >
        <h3>Add Transaction</h3>
        <Text style={styles.Text}>Asset/Liability Type</Text>
        <select
          onChange={this.handleChange('type')}
          value={type || 0}
          style={{
            borderColor: '#999',
            borderWidth: 1,
            borderStyle: 'solid',
            marginBottom: 10,
            padding: '4px 8px',
          }}
        >
          {assetDefs.map((asset) => {
            return (
              <option value={asset.enum} key={asset.name}>
                {asset.name}
              </option>
            );
          })}
        </select>

        <Text style={styles.Text}>Symbol</Text>
        <TextInput
          autoCapitalize="characters"
          style={styles.TextInput}
          value={symbol || ''}
          onChange={this.handleChange('symbol')}
        />

        <Text style={styles.Text}>Transaction Type</Text>
        <select
          onChange={this.handleChange('t_type')}
          value={t_type || 0}
          style={{
            borderColor: '#999',
            borderWidth: 1,
            borderStyle: 'solid',
            marginBottom: 10,
            padding: '4px 8px',
          }}
        >
          {
            selectedAssetType.t_types.map((transType) => {
              return (
                <option value={transType.enum} key={transType.name}>
                  {transType.name}
                </option>
              );
            })
          }
        </select>

        <Text style={styles.Text}>Date</Text>
        <Popover
          content={
            <DatePicker
              value={date}
              onChange={this.handleDateChange}
              maxDate={new Date()}
            />
          }
          interactionKind={PopoverInteractionKind.CLICK}
          onClose={this.closePopover}
          onInteraction={this.openPopover}
          isOpen={isOpen}
        >
          <View
            accessibilityRole="button"
            className="pt-button"
            style={styles.button}
          >
            {date ? date.toString() : 'Tap to select'}
          </View>
        </Popover>

        <Text style={styles.Text}>
          {selectedAssetType.enum === 0 ? 'Price ($)' : 'Amount (in currency)'}
        </Text>
        <TextInput
          style={styles.TextInput}
          value={amount || ''}
          keyboardType="numeric"
          onChange={this.handleChange('amount')}
        />

        {
          selectedAssetType.enum === 0 &&
          <View>
            <Text style={styles.Text}>Shares</Text>
            <TextInput
              style={styles.TextInput}
              value={shares || ''}
              keyboardType="numeric"
              onChange={this.handleChange('shares')}
            />
          </View>
        }

        <Text style={styles.Text}>Notes</Text>
        <TextInput
          style={styles.TextInput}
          value={notes || ''}
          onChange={this.handleChange('notes')}
        />

        <View
          className="pt-button-group"
          style={styles.buttonContainer}
        >
          <View
            onClick={this.saveTransaction}
            accessibilityRole="button"
            className="pt-button pt-icon-endorsed pt-intent-primary"
          >
            Save
          </View>
          {
            typeof onClose === 'function' &&
            <View
              onClick={this.handleClose}
              accessibilityRole="button"
              className="pt-button"
            >
              Close
            </View>
          }
        </View>
      </View>
    );
  }
}

export default AddTransactionForm;
