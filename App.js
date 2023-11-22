import React, { Component } from 'react';
import { View, BackHandler, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import MessageList from "./components/MessageList";
import { createImageMessage, createLocationMessage, createTextMessage } from "./utils/MessageUtils";

class Message extends Component {
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
    this.setState({ fullscreenImageId: null });
  };

  handlePressMessage = ({ id, type }) => {
    if (type === 'image') {
      this.setState({ fullscreenImageId: id });
    }
  };

  renderMessageList = () => {
    const { messages } = this.state;

    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={this.handlePressMessage} />
      </View>
    );
  };

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;
    const image = messages.find((message) => message.id === fullscreenImageId);

    if (!image || image.type !== 'image') return null;

    const { uri } = image;

    return (
      <TouchableWithoutFeedback onPress={this.dismissFullscreenImage}>
        <View style={styles.fullscreenContainer}>
          <Image style={styles.fullscreenImage} source={{ uri }} resizeMode="contain" />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;

      if (fullscreenImageId) {
        this.dismissFullscreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderMessageList()}
        {this.renderFullscreenImage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  fullscreenContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default Message;
