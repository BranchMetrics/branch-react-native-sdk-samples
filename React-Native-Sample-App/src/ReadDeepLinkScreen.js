import React, {useState, useEffect} from 'react';

import branch from 'react-native-branch';

import {View, Text, StyleSheet, ScrollView} from 'react-native';

function ReadDeepLinkScreen() {
  // Configure Parameters from the current open session
  async function configureSessionParameters() {
    const latestParams = await branch.getLatestReferringParams();
    let sessionParams = JSON.stringify(latestParams, null, 2);
    return sessionParams;
  }

  // Configure Parameters from the initial app install link data.
  async function configureInstallParameters() {
    const installParams = await branch.getFirstReferringParams();
    let firstParams = JSON.stringify(installParams, null, 2);
    return firstParams;
  }

  // Set parameters to respective boxes
  const [sessionParameters, setSessionParameters] = useState('');
  const [installParameters, setInstallParameters] = useState('');
  useEffect(() => {
    async function getParameters() {
      setSessionParameters(await configureSessionParameters());
      setInstallParameters(await configureInstallParameters());
    }
    getParameters();
  }, []);

  return (
    <ScrollView>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            margin: 20,
            width: 325,
            fontFamily: 'Raleway-MediumItalic',
            color: '#050E3C',
          }}>
          Session Parameters are determined each time the app is initialized.{' '}
          {'\n'}
          {'\n'}
          Install Parameters are determined when the app is first installed.
        </Text>

        <Text style={{color: '#711DF4', fontFamily: 'Raleway-Medium'}}>
          Session Parameters
        </Text>
        <Text style={styles.textWithBorder}>{sessionParameters}</Text>
        <Text style={{color: '#711DF4', fontFamily: 'Raleway-Medium'}}>
          Install Parameters
        </Text>
        <Text style={styles.textWithBorder}>{installParameters}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textWithBorder: {
    fontFamily: 'Raleway-Regular',
    width: 325,
    margin: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlign: 'left',
    color: '#1F2852',
  },
});

export default ReadDeepLinkScreen;
