/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  TextInput,
  TouchableHighlight,
  Text,
  StyleSheet,
  View,
} from 'react-native';


import branch, { BranchEvent } from 'react-native-branch';

import WebView from 'react-native-webview';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 64,
  },
  textInput: {
    flex: 0.08,
  },
  webView: {
    flex: 0.77,
  },
  button: {
    backgroundColor: '#cceeee',
    borderColor: '#2266aa',
    borderTopWidth: 1,
    flex: 0.15,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#2266aa',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

interface MyState {
  text: string
  url: string
  title: string
  image: string
}

class App extends React.Component<any, MyState> {
  buo: any;
  _unsubscribeFromBranch: any;

  constructor(props: any) {
    super(props);
    this.state = {
      text: 'https://branch.io',
      url: 'https://branch.io',
      title: "Branch",
      image: ""
    };
  }

  //Read deep link
  componentDidMount() {
    console.log("componentDidMount")

    this._unsubscribeFromBranch = branch.subscribe(({ error, params, uri }) => {
      if (error) {
        console.error('Error from Branch: ' + error)
        return
      }

      console.log(`Branch params for ${JSON.stringify(uri)}: ${JSON.stringify(params)}`);

      if (params) {
        if (!params['+clicked_branch_link']) {
          if (!!params['+non_branch_link']) {
            this.setState({ url: params['+non_branch_link'] as string, title: JSON.stringify(params['+non_branch_link']) });
          }
          return;
        }

        // Get title and url for route
        let title = params.$og_title;
        let url = params.$canonical_url as string;
        let image = params.$og_image_url;

        // Now reload the webview
        this.setState({ url: url, title: JSON.stringify(title), image: JSON.stringify(image) });
      }
    });

    this.registerView();
  }

  componentWillUnmount() {
    if (this._unsubscribeFromBranch) {
      console.log("unsubscribe")
      this._unsubscribeFromBranch();
      this._unsubscribeFromBranch = null;
    }

    if (this.buo) {
      this.buo.release();
      this.buo = null;
    }
  }


  render() {
    return (
      <View
        style={styles.container} >
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({ text: text })}
          onEndEditing={this.editingEnded.bind(this)}
          placeholder={'Enter Branch or non-Branch URL'}
          autoCapitalize={'none'}
          autoCorrect={false}
          value={this.state.text}
        />
        <WebView
          style={styles.webView}
          source={{ uri: this.state.url }}
          onLoad={this.registerView.bind(this)}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        />
        <TouchableHighlight
          onPress={this.onShare.bind(this)}
          style={styles.button} >
          <Text
            style={styles.buttonText}>
            Share
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  editingEnded() {
    console.log("text is " + this.state.text)
    branch.openURL(this.state.text);
  }

  _onNavigationStateChange(webViewState: any) {
    console.log("navigated to url " + webViewState.url)
    this.setState({ url: webViewState.url })
  }


  async registerView() {
    if (this.buo) {
      this.buo.release();
    }

    if (this.state.url === '') {
      return;
    }

    this.buo = await branch.createBranchUniversalObject(
      "item/12345",
      {
        canonicalUrl: `${this.state.url}`,
        title: "My Item Title",
        contentMetadata: {
          quantity: 1,
          price: 23.20,
          sku: "1994320302",
          productName: "my_product_name1",
          productBrand: "my_prod_Brand1",
          customMetadata: {
            custom_key1: "custom_value1",
            custom_key2: "custom_value2"
          }
        }
      }
    )

    let params = {
      transaction_id: "tras_Id_1232343434",
      currency: "USD",
      revenue: 180.2,
      shipping: 10.5,
      tax: 13.5,
      coupon: "promo-1234",
      affiliation: "high_fi",
      description: "Preferred purchase",
      purchase_loc: "Palo Alto",
      store_pickup: "unavailable",
      custom_data: {
        "Custom_Event_Property_Key1": "Custom_Event_Property_val1",
        "Custom_Event_Property_Key2": "Custom_Event_Property_val2"
      }
    }
    let event = new BranchEvent(BranchEvent.ViewItem, [this.buo], params)
    event.logEvent()

    console.log("Created Branch Universal Object and logged standard view item event.");
  }

  async onShare() {

    let shareOptions = {
      messageHeader: 'Check this out',
      messageBody: 'No really, check this out!'
    }

    let linkProperties = {
      feature: 'sharing',
      channel: 'facebook'
    }

    let controlParams = {
      $desktop_url: 'http://example.com/home',
      $ios_url: 'http://example.com/ios'
    }

    let { channel, completed, error } = await this.buo.showShareSheet(shareOptions, linkProperties, controlParams)


    // let { channel, completed, error } = await this.buo.showShareSheet({
    //   emailSubject: this.state.title,
    //   messageHeader: this.state.title,
    // }, {
    //   feature: "share",
    //   channel: "RNApp",
    // }, {
    //   $desktop_url: this.state.url,
    //   $ios_deepview: "branch_default",
    // });

    if (error) {
      console.error("Error sharing via Branch: " + error);
      return;
    }

    console.log("Share to " + channel + " completed: " + completed);
  }
}

export default App;
