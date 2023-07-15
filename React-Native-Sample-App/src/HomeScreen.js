import React, {useState, useEffect} from 'react';

import branch from 'react-native-branch';

import {useNavigation} from '@react-navigation/native';

import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Button,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import BranchUtils from './BranchUtils';
import ColorBlockScreen from './ColorBlockScreen';
import ReadDeepLinkScreen from './ReadDeepLinkScreen';

function HomeScreen({navigation}) {
  //Set a user ID on the events
  BranchUtils.login();

  // Listener for analytics and deep linking information
  branch.subscribe({
    onOpenStart: ({uri, cachedInitialEvent}) => {
      console.log(
        'subscribe onOpenStart, will open ' +
          uri +
          ' cachedInitialEvent is ' +
          cachedInitialEvent,
      );
    },
    onOpenComplete: ({error, params, uri}) => {
      if (error) {
        console.error(
          'subscribe onOpenComplete, Error from opening uri: ' +
            uri +
            ' error: ' +
            error,
        );
        return;
      }
      if (params) {
        if (!params['+clicked_branch_link']) {
          if (params['+non_branch_link']) {
            console.log('non_branch_link: ' + uri);

            // Route based on non-Branch links
            return;
          }
        } else {
          if (params['$deeplink_path']) {
            // handle params
            let deepLinkPath = params['$deeplink_path'].toString();
            //let canonicalUrl = params['$canonical_url'].toString();

            // Route based on Branch link data

            if (deepLinkPath == 'ColorBlockScreen') {
              navigation.navigate(ColorBlockScreen);
            } else if (deepLinkPath == 'ReadDeepLinkScreen') {
              navigation.navigate(ReadDeepLinkScreen);
            }
          }
          return;
        }
      }
    },
  });

  // Sets the Branch Link at top of screen
  const [url, setURL] = useState('');
  useEffect(() => {
    async function getURL() {
      const url = await BranchUtils.createDeepLink();
      setURL(url);
    }
    getURL();
  }, []);

  // Shows and hides the QR Code modal
  const [visible, setVisible] = useState(false);
  const showQRCode = () => setVisible(true);
  const hideQRCode = () => setVisible(false);

  // Sets the QR Code string on Page Load
  const [qrCodeString, setQRCodeString] = useState('');
  useEffect(() => {
    async function getQRCodeString() {
      const qrCode = await BranchUtils.createQRCode();
      setQRCodeString(qrCode);
    }
    getQRCodeString();
  });

  // Creates the navigation bar and sets elements
  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <Pressable onPress={BranchUtils.shareDeepLink}>
            <Image
              style={{width: 34, height: 34, marginRight: 7, marginTop: 4}}
              source={require('../assets/shareoutReact.png')}
            />
          </Pressable>
          <Pressable onPress={showQRCode}>
            <Image
              style={{width: 40, height: 40}}
              source={require('../assets/scanBarcodeReactNative.png')}
            />
          </Pressable>
        </View>
      ),
    });
  }, []);

  return (
    <SafeAreaView>
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={hideQRCode}>
        <SafeAreaView style={[styles.modalView]}>
          <Button title="Hide" onPress={hideQRCode} />
          <Image
            style={styles.qrCodeImage}
            source={{
              uri: qrCodeString,
            }}
          />
        </SafeAreaView>
      </Modal>
      <View style={{alignItems: 'center'}}>
        <TextInput
          numberOfLines={1}
          style={styles.branchLinkWithBorder}
          value={url}
          placeholder="Branch Link Here"
        />
        <Image
          style={styles.logoImage}
          source={require('../assets/branch-badge-dark.png')}
        />

        <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.5 : 1},
            styles.pressableStyle,
          ]}
          onPress={() => {
            BranchUtils.sendCustomEvent;
            Alert.alert('Custom Event sent!');
          }}>
          <Text style={styles.pressableText}>Send Custom Event</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.5 : 1},
            styles.pressableStyle,
          ]}
          onPress={() => {
            BranchUtils.sendPurchaseEvent;
            Alert.alert('Purchase event sent!');
          }}>
          <Text style={styles.pressableText}>Buy Now</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.5 : 1},
            styles.pressableStyle,
          ]}
          onPress={() => {
            BranchUtils.sendAddToCartEvent;
            Alert.alert('Add To Cart event sent!');
          }}>
          <Text style={styles.pressableText}>Add To Cart</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.5 : 1},
            styles.pressableStyle,
          ]}
          onPress={() => navigation.navigate(ColorBlockScreen)}>
          <Text style={styles.pressableText}>Color Block Page</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => [
            {opacity: pressed ? 0.5 : 1},
            styles.pressableStyle,
          ]}
          onPress={() => navigation.navigate(ReadDeepLinkScreen)}>
          <Text style={styles.pressableText}>Read Deep Link</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  branchLinkWithBorder: {
    fontFamily: 'Raleway-Medium',
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    color: '#1F2852',
  },
  logoImage: {
    height: 250,
    width: 250,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableStyle: {
    padding: 5,
    margin: 5,
    width: 300,
    height: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0074DF',
  },
  pressableText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Raleway-SemiBold',
  },
  modalView: {
    flex: 1,
    backgroundColor: '#DDD',
  },
  qrCodeImage: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginTop: 150,
  },
});

export default HomeScreen;
