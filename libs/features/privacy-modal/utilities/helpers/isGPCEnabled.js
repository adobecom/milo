const isGPCEnabled = () => !!window.navigator?.globalPrivacyControl;

export default isGPCEnabled;
