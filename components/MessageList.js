import React from 'react';
import { PropTypes } from 'prop-types';
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MassageShape } from '../utils/MessageUtils';

const keyExtractor = item => item.id.toString();

export default class MessageList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(MassageShape),
    onPressMessage: PropTypes.func,
  };

  static defaultProps = {
    onPressMessage: () => {},
  };

  handleDeleteMessage = (message) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => this.deleteMessage(message.id),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  deleteMessage = (messageId) => {
    const { messages } = this.props;
    const updatedMessages = messages.filter((message) => message.id !== messageId);
    console.log('Updated Messages:', updatedMessages);
  };

  renderMessageContent = ({ item }) => {
    const { onPressMessage } = this.props;

    switch (item.type) {
      case 'text':
        return (
        <View style={styles.messageRow}>
            <TouchableOpacity onPress={() => this.handleDeleteMessage(item)}>
              <View style={styles.messageBubble}>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );

      case 'image':
        return (
          <View style={styles.messageRow}>
            <Image style={styles.image} source={{ uri: item.uri }} />
          </View>
        );

      case 'location':
        if (item.coordinate) {
          return (
            <View style={styles.messageRow}>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    ...item.coordinate,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.04,
                  }}
                >
                  <Marker coordinate={item.coordinate} />
                </MapView>
              </View>
            </View>
          );
        } else {
          return <Text style={styles.locationText}>Location data is missing</Text>;
        }

      default:
        return null;
    }
  };

  render() {
    const { messages } = this.props;
    return (
      <FlatList
        style={styles.container}
        inverted
        data={messages}
        renderItem={this.renderMessageContent}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.contentContainer}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
    backgroundColor: 'white',
    marginTop: 40,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
  },
  messageBubble: {
    backgroundColor: '#218aff',
    padding: 10,
    borderRadius: 15,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 8,
  },
  mapContainer: {
    height: 200,
    width: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    borderRadius: 8,
  },
  locationText: {
    color: 'red',
    fontStyle: 'italic',
  },
});