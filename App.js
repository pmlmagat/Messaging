import React from 'react';
import { StyleSheet, View, ImageBackground, Image, Alert, TouchableHighlight, BackHandler } from 'react-native';
import MessageList from './components/MessageList'; 
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';

export default class App extends React.Component {
  state = {
    messages: [
      createImageMessage('https://unsplash.it/300/522'),
      createTextMessage('Montalbounce'),
      createTextMessage('To the'),
      createTextMessage('San ka punta?'),
      createLocationMessage({
        latitude: 14.7289,
        longitude: 121.1441,
      }),
    ],
    fullscreenImageId: null,
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null })
  };

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;
    if (!fullscreenImageId) return null;
  
    const image = messages.find(message => message.id === fullscreenImageId);
    if (!image) return null;
  
    const { uri } = image;
    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}
        underlayColor="transparent"
      >
        <Image style={styles.fullscreenImage} source={{ uri }} resizeMode="contain" />
      </TouchableHighlight>
    );
  };
  
  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            { 
              text: 'Cancel', 
              style: 'cancel' 
            },
            { 
              text: 'Delete',
              style: 'destructive',
              onPress: () => this.handleDeleteMessage(item.id)
            },
          ]
        );
        break;
      
      case 'image':
        this.setState({ fullscreenImageId: id });
        break;
      
      default:
        break;
    }
  };
  
  handleDeleteMessage = (id) => {
    this.setState((state) => ({
      messages: state.messages.filter(message => message.id !== id),
    }));
  };

  componentDidMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;
      if (fullscreenImageId) {
        this.dismissFullscreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  render() {
    return (
      <ImageBackground 
        source={{uri: 'https://mobcup.net/images/wt/631d5d0903dfbe61966a8bb4a646308e.jpg'}}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          {this.renderFullscreenImage()}
          <MessageList messages={this.state.messages} onPressMessage={this.handlePressMessage} />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white'
  },
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
});