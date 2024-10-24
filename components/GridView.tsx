import {View, StyleSheet} from 'react-native';
import React from "react";

interface Props<T> {
  data: T[];
  renderItem(item: T): React.JSX.Element;
  col?: number;
  gap?: number;
}

export default function GridView<T extends any>(props: Props<T>): React.JSX.Element {
  const {data, col = 3, renderItem} = props;

  return (
    <View style={styles.container}>
      {data.map((item, i) => (
        <View key={i} style={{width: `${95 / col }%`}}>
          <View>
            {renderItem(item)}
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10
  }
})