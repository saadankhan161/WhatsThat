import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class Member extends Component {
  handleRemove = () => {
    const { onRemove, member } = this.props;
    onRemove(member.user_id);
  };

  render() {
    const { member } = this.props;
    return (
      <View style={styles.memberContainer}>
        <Text>{member.first_name} {member.last_name}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={this.handleRemove}
        >
          <Text style={styles.removeButtonText}>Remove from chat</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
memberContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
backgroundColor: 'grey',
borderRadius: 20,
padding: 10,
marginBottom: 10,
},
removeButton: {
backgroundColor: 'red',
borderRadius: 4,
paddingVertical: 5,
paddingHorizontal: 10,
},
removeButtonText: {
color: 'white',
},
});

export default Member;