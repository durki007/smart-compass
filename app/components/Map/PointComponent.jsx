import { StyleSheet, View, Text, Button } from 'react-native';



const PointComponent = () => {



    return(
        <View style ={styles.detailsBox}>
            
        </View>

    );
}

const styles = StyleSheet.create({

    detailsBox: {
        // flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor:'#B8D8D8',
        width:'100%',
        height: '15%',
        paddingTop: 30,
        paddingLeft: 10,
        paddingBottom: 10,
        paddingRight: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
    
      headerLeftInnerBox: {
        flex: 1,
        flexDirection: 'column',
        height: 110,
        marginLeft:12,
        marginTop:10,
        marginBottom: 5,
      },
    
      headerText: {
        fontFamily: 'RobotoBlack',
        fontSize: 32,
      },
    
      headerRightInnerBox: {
        marginTop:10,
        width: 110,
      },
    
      headerImage: {
        height: 70,
        resizeMode: 'contain',
      },

})

export default PointComponent;