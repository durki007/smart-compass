import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import FileComponent from './FileComponent';

const MainContent = () => {
    return (
      <View style={styles.mainBox}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        fadingEdgeLength={10}
        centerContent={true}
        >
                <FileComponent name="John Doe" date="2024-04-13" num={5} />
                <FileComponent name="Radoslaw" date="2123-04-13" num={778} />
                <FileComponent name="Radoslaw" date="2123-04-13" num={778} />
                <FileComponent name="Radoslaw" date="2123-04-13" num={778} />
                <FileComponent name="Radoslaw" date="2123-04-13" num={778} />
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        flexDirection: 'column',
        alignSelf: 'center',
        width: '90%', 
    },

    mainBox: {
        flexDirection: 'column',
        width: '90%',
        borderRadius: 20,
        backgroundColor: 'rgba(238, 245, 219, 0.0)',
        paddingTop: 20,
        paddingHorizontal: 0,
        paddingBottom: 20,
    },
});

export default MainContent;
