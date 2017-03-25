import React, {
  Component,
  PropTypes,
} from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  connect,
} from 'react-redux';
import {
  Popover,
  Tab,
  Tabs,
  TabList,
  TabPanel,
} from '@blueprintjs/core';

import styles from '../styles';

import {
  addNewComparison,
  switchTabs,
  removeComparison,
} from '../actions';
import Icon from '../../../components/Icon';
import PerfTabPanel from './TabPanel';

const iconStyle = {
  cursor: 'pointer',
  textAlign: 'center',
  top: 2,
  position: 'relative',
  fontSize: 18,
};

class TabManager extends Component {
  static propTypes = {
    tabs: PropTypes.array,
    dispatch: PropTypes.func,
    selectedTabID: PropTypes.number,
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
    return tabs.map((tab) => {
      return (
        <TabPanel key={tab.id}>
          <PerfTabPanel />
        </TabPanel>
      );
    });
  }
  deleteTab = (id) => {
    return () => {
      const {
        dispatch,
      } = this.props;
      dispatch(removeComparison(id));
    };
  }
  handleTabChange = (newIndex) => {
    const {
      dispatch,
      tabs,
    } = this.props;
    dispatch(switchTabs(tabs[newIndex].id));
  }
  handleAdd = () => {
    const {
      dispatch,
    } = this.props;
    dispatch(addNewComparison());
  }
  render() {
    const {
      selectedTabID,
      tabs,
    } = this.props;
    let selectedTabIndex = 0;
    for (const i in tabs) {
      if (tabs[i].id === selectedTabID) {
        selectedTabIndex = parseInt(i, 10);
        break;
      }
    }
    return (
      <View>
        <Text style={styles.Text}>
          Compare portfolios and symbols here.
        </Text>
        <View
          className="pt-button-group"
          style={styles.buttonContainer}
        >
          <View
            accessibilityRole="button"
            className="pt-button pt-icon-add pt-intent-primary"
            onClick={this.handleAdd}
          >
            New Comparison
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
    tabs: state.perfReducer.tabs || [],
    selectedTabID: state.perfReducer.selectedTabID,
  };
}

export default connect(mapStateToProps)(TabManager);
