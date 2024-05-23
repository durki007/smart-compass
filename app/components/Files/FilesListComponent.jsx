import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import FileComponent from './FileComponent';


const MainContent = ({ savedRoutes, deleteRoute, renameRoute }) => {
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
            >
                {savedRoutes.map((route, index) => (
                    <FileComponent
                    key={route.id} 
                    name={route.data.name} //TODO: include this data
                    date={route.data.date} //TODO: include this data
                    num={route.data.length} // TODO: count markers
                    thisRoute={route}
                    deleteRoute={deleteRoute}
                    renameRoute={renameRoute}
                />
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
        width: '90%',
    },

    mainBox: {
        flex: 1,
        width: '90%',
        borderRadius: 20,
        paddingTop: 30,
        paddingHorizontal: 0,
        paddingBottom: 20,
    },
});

export default MainContent;
