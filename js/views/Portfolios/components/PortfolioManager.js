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
  connect,
} from 'react-redux';
import {
  Popover,
  PopoverInteractionKind,
  Tab,
  Tabs,
  TabList,
  TabPanel,
} from '@blueprintjs/core';

// add blueprint table css
import '../../../../node_modules/@blueprintjs/table/dist/table.css';
import styles from '../styles';

import {
  addPortfolio,
  switchTabs,
  exportExcelDoc,
  removePortfolio,
} from '../actions';
import Icon from '../../../components/Icon';
import PortfolioEditor from './PortfolioEditor';

const iconStyle = {
  cursor: 'pointer',
  textAlign: 'center',
  top: 2,
  position: 'relative',
  fontSize: 18,
};

class PortfolioManager extends Component {
  static propTypes = {
    tabs: PropTypes.array,
    dispatch: PropTypes.func,
    selectedTabID: PropTypes.number,
  }
  state = {
    portfolioName: '',
    isOpen: false,
  }
  getTabs = () => {
    const {
      tabs,
    } = this.props;
    return (
      <TabList>
        {tabs.map((tab, i) => {
          return (
            <Tab key={tab.id}>
              <View style={styles.tabContents}>
                {tab.name || `Comparison ${i + 1}`}
                {
                  tabs.length > 1 &&
                  <Popover
                    content={(
                      <View className="pt-card">
                        <View
                          onClick={this.deleteTab(tab.id)}
                          accessibilityRole="button"
                          className="pt-button pt-intent-danger"
                        >
                          Delete
                        </View>
                      </View>
                    )}
                  >
                    <Icon
                      name="close"
                      style={iconStyle}
                    />
                  </Popover>
                }
              </View>
            </Tab>
          );
        })}
      </TabList>
    );
  }
  getTabPanels = () => {
    const {
      tabs,
    } = this.props;
    return tabs.map((row) => {
      return (
        <TabPanel key={row.id}>
          <PortfolioEditor
            id={row.id}
          />
        </TabPanel>
      );
    });
  }
  deleteTab = (id) => {
    return () => {
      const {
        dispatch,
      } = this.props;
      dispatch(removePortfolio(id));
    };
  }
  addPortfolio = () => {
    const {
      dispatch,
    } = this.props;
    const {
      portfolioName,
    } = this.state;
    this.closePopover();
    dispatch(addPortfolio(portfolioName));
    this.setState({
      portfolioName: '',
    });
  }
  handlePortfolioNameChange = (e) => {
    this.setState({
      portfolioName: e.target.value,
    });
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
  handleTabChange = (newIndex) => {
    const {
      dispatch,
      tabs,
    } = this.props;
    dispatch(switchTabs(tabs[newIndex].id));
  }
  exportExcel = () => {
    const {
      dispatch,
    } = this.props;
    dispatch(exportExcelDoc());
  }
  render() {
    const {
      portfolioName,
      isOpen,
    } = this.state;
    const {
      tabs,
      selectedTabID,
    } = this.props;
    let selectedTabIndex = 0;
    for (const i in tabs) {
      if (tabs[i].id === selectedTabID) {
        selectedTabIndex = parseInt(i, 10);
        break;
      }
    }
    const addPortfolioPopoverContent = (
      <View className="pt-card">
        <Text>Name</Text>
        <TextInput
          style={styles.TextInput}
          value={portfolioName}
          onChange={this.handlePortfolioNameChange}
        />
        <View
          className="pt-button-group"
          style={styles.buttonContainer}
        >
          <View
            onClick={this.addPortfolio}
            accessibilityRole="button"
            className="pt-button pt-icon-endorsed pt-intent-primary"
          >
            Save
          </View>
        </View>
      </View>
    );
    return (
      <View>
        <Text style={styles.Text}>
          {'Manage your portfolios here. Add and edit your portfolio\'s transactions in the table.'}
        </Text>
        <View
          className="pt-button-group"
          style={styles.buttonContainer}
        >
          <Popover
            content={addPortfolioPopoverContent}
            interactionKind={PopoverInteractionKind.CLICK}
            onClose={this.closePopover}
            onInteraction={this.openPopover}
            isOpen={isOpen}
          >
            <View
              accessibilityRole="button"
              className="pt-button pt-icon-add pt-intent-primary"
            >
              Add a Portfolio
            </View>
          </Popover>
          <View
            accessibilityRole="button"
            className="pt-button pt-icon-export"
            onClick={this.exportExcel}
          >
            Export all to Excel (.xlsx)
          </View>
        </View>
        <Text style={styles.Text} />
        <Text style={styles.Text} />
        <View>
          <Tabs onChange={this.handleTabChange} selectedTabIndex={selectedTabIndex}>
            {this.getTabs()}
            {this.getTabPanels()}
          </Tabs>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    tabs: state.portfolios.tabs || [],
    selectedTabID: state.portfolios.selectedTabID,
  };
}

export default connect(mapStateToProps)(PortfolioManager);
