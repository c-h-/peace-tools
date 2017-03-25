import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import Icon from '../../components/Icon';

import styles from './styles';

const Hello = () => {
  return (
    <View style={styles.container}>
      <View className="pt-card pt-elevation-2">
        <h2>Hello!</h2>
        <Text style={styles.Text}>
          When I was looking around for a tool that would help me keep track of diverse
          portfolios it was hard to find a good, free solution that I could trust. For that
          need I built this tool.
        </Text>
        <Text style={styles.Text} />

        <h3><Icon name="view-list" /> Portfolios and Transactions</h3>
        <Text style={styles.Text}>You can keep track of Cash assets (and debts), equity stocks,
          ETFs, Bitcoin, and Ethereum with Peace Tools. Simply create a portfolio and add your
          transactions. Then use the Performance tab to analyze the portfolio over time.</Text>
        <Text style={styles.Text} />

        <h3><Icon name="timeline" /> Performance Comparisons and Charts</h3>
        <Text style={styles.Text}>Charts are the heart of this app. In the Performance tab you
          can mix and match portfolios you&lsquo;ve saved with each other and with symbols on the
          market. Set whatever time range you&lsquo;re looking for. Choose between sum and compare
          modes. Sum mode sums the values you&lsquo;re analyzing, which is useful for meta-analysis
          of your portfolios overall. Compare mode plots values side by side, useful for looking at
          stocks and similar portfolios.</Text>
        <Text style={styles.Text} />

        <h3><Icon name="lock" /> Private, Secure, and Open-Source</h3>
        <Text style={styles.Text}>Your finances are your business only. This app never sends your
          financial data anywhere. Keep in mind this means that if you clear your browser storage
          then your data is gone irrecoverably. Export to Excel and back up regularly.
        </Text>
        <Text style={styles.Text}>The only data sent to servers from the app is anonymous usage data
          to help with planning features and gauging usage, as well as anonymous data about any
          errors that happen while using the app, so that bugs can be discovered, prioritized,
          and fixed.
        </Text>
        <Text style={styles.Text}>{'You can review, verify, and contribute to this app\'s codebase '
          + 'via the GitHub repository.'}
        </Text>
        <Text style={styles.Text}>Coming soon: data saved by this app is encrypted locally using
          AES encryption.
        </Text>
        <Text style={styles.Text} />

        <h3><Icon name="settings" /> Settings</h3>
        <Text style={styles.Text}>Data is pulled from the excellent meta-database Quandl. You will
            need a proper Quandl API key to pull new data in the Settings page. Without a Quandl API
            key the app will attempt to fall back to other less solid APIs.</Text>
        <Text style={styles.Text}>Adding a Bing Search API Key allows you to see news headlines for
          selected assets in the Performance tab.</Text>
        <Text style={styles.Text} />

        <h3><Icon name="touch-app" /> Caching and Responsiveness</h3>
        <Text style={styles.Text}>This app should remain responsive while loading due to offloading
          data processing and networking to worker threads. You will also get a boost from
          aggressive network caching. Network caching should mean you should never have to request
          the same data twice.
        </Text>

        <h3><Icon name="cloud" /> Data Sources</h3>
        <Text style={styles.Text}>This app pulls data from a variety of APIs. Where possible the app
          APIs that expressly allow the data to be accessed in the way this app requires (Quandl,
          Bing APIs). See the settings page to configure API keys. Other APIs supplement the
          coverage that Quandl and Bing provide.
        </Text>
      </View>
    </View>
  );
};

export default Hello;
