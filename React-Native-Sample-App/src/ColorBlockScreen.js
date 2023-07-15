import React, {useState, useEffect} from 'react';

import branch from 'react-native-branch';

import {View, Text, StyleSheet} from 'react-native';

function ColorBlockScreen() {
  // Gets blockColor parameter from latest session parameters
  async function GetColorParam() {
    let latestParams = await branch.getLatestReferringParams(); // params from last open
    let blockColor;
    if (latestParams['blockColor']) {
      blockColor = latestParams['blockColor']?.toString();
    } else {
      blockColor = 'white';
    }
    return blockColor;
  }

  // Sets block color and text to specified blockColor parameter
  const [color, setColor] = useState('');
  useEffect(() => {
    async function getColor() {
      const color = await GetColorParam();
      setColor(color);
    }
    getColor();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text
        style={{
          width: 360,
          textAlign: 'center',
          marginTop: 20,
          fontFamily: 'Raleway-MediumItalic',
          color: '#050E3C',
        }}>
        The default color of the block is white. {'\n'}
        When this page opens via deep link with a specified "blockColor"
        parameter, the block changes to the specified color.
      </Text>
      <View
        style={{
          backgroundColor: color,
          height: 200,
          width: 200,
          margin: 75,
          borderWidth: 2,
          borderRadius: 25,
        }}
      />
      <Text style={styles.baseText}>The block color is {color}.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Raleway-Medium',
    textAlign: 'center',
    color: '#050E3C',
  },
});

export default ColorBlockScreen;
