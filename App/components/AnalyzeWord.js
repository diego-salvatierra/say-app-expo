import { Text, View, StyleSheet } from "react-native";

const AnalyzeWord= ({ word, id }) => {
    console.log("word.said is ", word.said)
    
    if (word.said) {
        return (
            <View>
                <Text style={styles.ifSaid}>{word.word + " "}</Text>
            </View>
        )
    }

    if (!word.said) {
        return (
            <View>
                <Text style={styles.ifNotSaid}>{word.word + " "}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ifSaid: {
        color: '#8CFF98',
        fontSize: 20,
    },
    ifNotSaid: {
        color: 'white',
        fontSize: 20,
    },
});

export default AnalyzeWord