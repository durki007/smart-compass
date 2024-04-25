import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import FileComponent from './FileComponent';

const MainContent = ({ savedRoutes }) => {
    const [rerenderKey, setRerenderKey] = useState(0);

    // Update rerenderKey whenever savedRoutes changes
    useEffect(() => {
        setRerenderKey(prevKey => prevKey + 1);
    }, [savedRoutes]);

    return (
        <View key={rerenderKey} style={styles.mainBox}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
                fadingEdgeLength={10}
                centerContent={true}
            >
                {savedRoutes.map((route, index) => (
                    <FileComponent key={index} name='X' date="2024-04-13" num={5} thisRoute={route} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        flexDirection: 'column',
        alignSelf: 'center',
        // justifyContent: 'center',
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
