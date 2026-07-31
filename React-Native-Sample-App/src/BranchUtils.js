import branch, {BranchEvent} from 'react-native-branch';

export default class BranchUtils {
  // Creates a Branch Universal Object to be used in Branch functions
  static createContentReference = async () => {
    let buo = await branch.createBranchUniversalObject('content/12345', {
      title: 'Universal Object Test',
      contentDescription: 'My Content Description',
      contentMetadata: {
        customMetadata: {
          key1: 'value1',
        },
      },
    });
    return buo;
  };

  // Creates Link Properties for in-app generated links and QR Codes
  static createLinkProperties = async () => {
    let linkProperties = {
      feature: 'sharing',
      channel: 'channel example here',
      campaign: 'campaign example here',
    };
    return linkProperties;
  };

  // Creates Control Parameters for deep link routing and mobile/desktop web redirection
  static createControlParameters = async () => {
    let controlParams = {
      $desktop_url: 'http://example.com/home',
      $ios_url: 'http://example.com/ios',

      // $deeplink_path can be either 'ReadDeepLinkScreen' or 'ColorBlockScreen' to test routing to a specific page.
      // $deeplink_path: 'ReadDeepLinkScreen',
      $deeplink_path: 'ColorBlockScreen',

      // Other blockColor options include 'blue', 'red', 'yellow', 'purple'
      blockColor: 'green',
    };
    return controlParams;
  };

  // Creates a Branch Deep Link with analytics information and deep linking properties
  static createDeepLink = async () => {
    let buo = await this.createContentReference();
    let linkProperties = await this.createLinkProperties();
    let controlParams = await this.createControlParameters();

    let {url} = await buo.generateShortUrl(linkProperties, controlParams);
    return url;
  };

  // Opens the share sheet and creates a Branch deep link in the message
  static shareDeepLink = async () => {
    let buo = await this.createContentReference();
    let linkProperties = await this.createLinkProperties();
    let controlParams = await this.createControlParameters();

    let shareOptions = {
      messageHeader: 'Check this out',
      messageBody: 'No really, check this out!',
    };

    let {channel, completed, error} = await buo.showShareSheet(
      shareOptions,
      linkProperties,
      controlParams,
    );
  };

  // Creates a QR Code with Branch link parameters
  static createQRCode = async () => {
    let qrCodeSettings = {
      width: 800,
      codeColor: '#6a09d9',
      backgroundColor: '#fac3c3',
      centerLogo: 'https://i.snipboard.io/5PW62T.jpg',
      margin: 1,
      imageFormat: 'JPG',
    };

    let buo = await this.createContentReference();
    let linkProperties = await this.createLinkProperties();
    let controlParams = await this.createControlParameters();

    try {
      let result = await branch.getBranchQRCode(
        qrCodeSettings,
        buo,
        linkProperties,
        controlParams,
      );

      return Promise.resolve('data:image/png;base64,' + result);
    } catch (err) {
      return Promise.reject('BranchWrapper QR Code Err: ' + err);
    }
  };

  // Sends a custom Branch event. This event can be named anything.
  static sendCustomEvent = async () => {
    let buo = await this.createContentReference();

    let eventParams = {
      alias: 'my custom alias',
      customData: {
        Custom_Event_Property_Key1: 'Custom_Event_Property_val1',
        Custom_Event_Property_Key2: 'Custom_Event_Property_val2',
      },
    };
    let event = new BranchEvent('Custom Event Example', buo, eventParams); //pass null if no BranchUniversalObject is used
    event.logEvent();
  };

  // Sends a standard Branch Purchase Event
  static sendPurchaseEvent = async () => {
    let buo = await this.createContentReference();

    let eventParams = {
      transaction_id: 'tras_Id_1232343434',
      currency: 'USD',
      revenue: 180.2,
      shipping: 10.5,
      tax: 13.5,
      coupon: 'promo-1234',
      affiliation: 'high_fi',
      description: 'Preferred purchase',
      purchase_loc: 'Palo Alto',
      store_pickup: 'unavailable',
      customData: {
        Custom_Event_Property_Key1: 'Custom_Event_Property_val1',
        Custom_Event_Property_Key2: 'Custom_Event_Property_val2',
      },
    };
    let event = new BranchEvent(BranchEvent.Purchase, [buo], eventParams);
    event.logEvent();
  };

  // Sends a standard Branch Add to Cart Event
  static sendAddToCartEvent = async () => {
    let buo = await this.createContentReference();

    let eventParams = {
      transaction_id: 'tras_Id_1232343434',
      currency: 'USD',
      revenue: 50.22,
      shipping: 13.1,
      tax: 2.2,
      coupon: 'promo-1234',
      affiliation: 'high_fi',
      description: 'Add to Cart Standard Event',
      purchase_loc: 'Palo Alto',
      store_pickup: 'unavailable',
      customData: {
        Custom_Event_Property_Key1: 'Custom_Event_Property_val1',
        Custom_Event_Property_Key2: 'Custom_Event_Property_val2',
      },
    };
    let event = new BranchEvent(BranchEvent.AddToCart, [buo], eventParams);
    event.logEvent();
  };

  /* 
        Set a user ID on the events
        • Used for cross-device and cross-platform attribution
        • Do NOT pass PII in. More info and best practices: https://help.branch.io/using-branch/docs/best-practices-to-avoid-sending-pii-to-branch#developer-identity 
    */
  static login = async id => {
    branch.setIdentity(id);
  };

  /* 
          Logout when the session ends
          • Removes the user ID from any events tracked AFTER this call 
          • Does NOT retroactively remove the ID on events already tracked
      */
  static logout = async () => {
    branch.logout();
  };
}
