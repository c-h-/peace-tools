import React, { PropTypes } from 'react';
import {
  Text,
  View,
} from 'react-native';

import {
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import parseDate from '../../../../utils/parseDate';
import Link from '../../../../components/Link';
import {
  SYM_DELIMETER,
} from '../../../../constants/misc.json';
import symbolTypes from '../../../../constants/symbolTypes.json';
import styles from '../../styles';
import colors from '../../../../constants/colors.json';

const metricColors = {
  positive: 'rgb(39, 174, 96)',
  negative: 'rgb(192, 57, 43)',
};

function getTitle(col) {
  const ind = col.indexOf(SYM_DELIMETER);
  if (ind !== -1) {
    const type = col.slice(0, ind);
    if (type !== symbolTypes.PORTFOLIO) {
      return col.slice(ind + SYM_DELIMETER.length);
    }
  }
  return col;
}

function renderPopoverContent(content) {
  return (
    <View style={styles.popover}>
      {content}
    </View>
  );
}

const StatBlock = (props) => {
  const {
    col,
    cols,
    data,
    headlines,
  } = props;
  const columnValues = cols.map(symbol => symbol.value).sort();
  const color = colors[columnValues.indexOf(col) % colors.length];
  if (!data || !data[0] || !data[1]) {
    return null;
  }
  const startVal = (data[0][col] || 0).toFixed(2);
  const endVal = (data[1][col] || 0).toFixed(2);
  let changeRatio = '-';
  if (startVal > 0) {
    changeRatio = (((endVal - startVal) / startVal) * 100).toFixed(2);
  }
  const diff = (endVal - startVal).toFixed(2);
  const metricColor = diff > 0 ? {
    color: metricColors.positive,
  } : {
    color: metricColors.negative,
  };
  let formattedHeadlines = [];
  if (
    headlines
    && headlines.value
  ) {
    formattedHeadlines = headlines.value;
  }
  return (
    <View style={styles.StatBlock} className="pt-card pt-elevation-1">
      <Text style={[styles.StatBlockHeader, { color }]}>{getTitle(col)}</Text>
      <View style={styles.StatBlocks}>
        <View style={styles.StatBlockData}>
          <Text style={styles.StatBlockLabel}>Change (%)</Text>
          <Text style={[styles.StatBlockMetric, metricColor]}>{changeRatio}%</Text>
        </View>
        <View style={styles.StatBlockData}>
          <Text style={styles.StatBlockLabel}>Change ($)</Text>
          <Text style={[styles.StatBlockMetric, metricColor]}>${diff}</Text>
        </View>
        <View style={styles.StatBlockData}>
          <Text style={styles.StatBlockLabel}>Start</Text>
          <Text style={styles.StatBlockMetric}>${startVal}</Text>
        </View>
        <View style={styles.StatBlockData}>
          <Text style={styles.StatBlockLabel}>End</Text>
          <Text style={styles.StatBlockMetric}>${endVal}</Text>
        </View>
      </View>
      <Text>Current Headlines</Text>
      <View style={styles.headlines}>
        {
          formattedHeadlines &&
          formattedHeadlines.filter((_, i) => i < 5).map((headline) => {
            return (
              <View key={headline.url} style={styles.headline}>
                <Popover
                  content={renderPopoverContent(headline.description)}
                  interactionKind={PopoverInteractionKind.HOVER}
                  position={Position.TOP}
                  hoverOpenDelay={500}
                >
                  <Link
                    href={headline.url}
                    style={{ color }}
                  >
                    {headline.name}
                  </Link>
                </Popover>
                <View style={styles.tags}>
                  <Text
                    style={styles.tag}
                    className="pt-tag pt-minimal"
                    key={headline.datePublished}
                  >
                    {parseDate(headline.datePublished)
                  }</Text>
                  <Text
                    style={styles.tag}
                    className="pt-tag pt-minimal"
                    key={headline.category}
                  >
                    {headline.category}
                  </Text>
                  {
                    headline.provider &&
                    headline.provider.map((provider) => {
                      return (
                        <Text
                          style={styles.tag}
                          className="pt-tag pt-minimal"
                          key={provider.name}
                        >
                          {provider.name}
                        </Text>
                      );
                    })
                  }
                </View>
              </View>
            );
          })
        }
      </View>
    </View>
  );
};

StatBlock.propTypes = {
  col: PropTypes.string,
  cols: PropTypes.array,
  data: PropTypes.array,
  headlines: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
};

export default StatBlock;
