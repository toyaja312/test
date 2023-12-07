import React, {useState, useEffect} from 'react'
//import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert, Modal, Pressable, Dimensions } from 'react-native';
import {colors, CLEAR, ENTER, colorsToEmoji} from './constants'
import Keyboard from './components/Keyboard'
//import * as Clipboard from 'expo-clipboard'
import { NAMES } from './names/namesList'
import { VALID_NAMES } from './names/validNames'
//import Animated, {SlideInDown, SlideInLeft, ZoomIn, FlipInEasyY} from 'react-native-reanimated'


const NUMBER_OF_TRIES = 6

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])]
}

const randomChoice = Math.floor(Math.random() * NAMES.length)
//const name = NAMES[randomChoice]

export default function App() {
  //const [modalVisible, setModalVisible] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true)
  const [alertVisible, setAlertVisible] = useState(false);
  const [winVisible, setWinVisible] = useState(false);
  const [againVisible, setAgainVisible] = useState(false);
  
  const [name, setName] = useState(NAMES[randomChoice])
  console.log('name:', name)

  const letters = name.split('')
  
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
  )
  
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)
  const [gameState, setGameState] = useState('playing')

  const [word, setWord] = useState('')

  useEffect(() => {
    // function delayModalClose() {
    //     setModalVisible(false)
    // }
    function delayKeyboard() {
      setShowKeyboard(true)
    }
    if (currentRow > 0) {
      //setTimeout(delayModalClose, 100);
      //setModalVisible(false)
      setTimeout(delayKeyboard, 50);
      checkIfValid()
    }
  }, [currentRow])

  const checkIfValid = () => {
    const row = rows[currentRow - 1].join('')
    //console.log('row in checkIfValid:', row)
    if (!VALID_NAMES.includes(row)) {
      //console.log(row, 'is not a valid name')
      setWord(row)
      rows.splice(currentRow - 1, 1, Array(letters.length).fill('') )
      setRows(rows)
      setCurrentRow(currentRow - 1)
      setCurrentCol(0)
      setAlertVisible(true)
      //Alert.alert(row.toUpperCase(), 'is not a valid name')
      //alert(row.toUpperCase(), 'is not a valid name')
      return
      
    } else {
      //console.log(row, 'is a valid name')
      setCurrentCol(0)
      checkGameState()
      return
    }
  }

  const checkGameState = () => {
    if (checkIfWon() && gameState !== 'won') {
      // Alert.alert('Hurray!', 'You won!', [
      //   {text: 'Play Again', onPress: restart},
      //   {text: 'Share', onPress: shareScore}
      // ])
      // alert('Hurray!', 'You won!', [
      //     {text: 'Play Again', onPress: restart},
      //     {text: 'Share', onPress: shareScore}
      //   ])
      setWinVisible(true)
      setGameState('won')
    } else if (checkIfLost() && gameState !== 'lost') {
      // Alert.alert(name.toUpperCase(), '', [
      //   {text: 'Play Again', onPress: restart},
      //   {text: 'Share', onPress: shareScore}
      // ])
      // alert(name.toUpperCase(), '', [
      //   {text: 'Play Again', onPress: restart},
      //   {text: 'Share', onPress: shareScore}
      // ])
      setAgainVisible(true)
      setGameState('lost')
    }
  }

  const checkIfWon = () => {
    const row = rows[currentRow - 1]
    return row.every((letter, i) => letter === letters[i])
  }

  const checkIfLost = () => {
    return !checkIfWon() && currentRow === rows.length
  }

  const shareScore = () => {
    const textMap = rows
      .map((row, i) => 
        row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join('')
      )
      .filter((row) => row)
      .join('\n')
    const textToShare = `Names Game \n ${textMap}`
    //Clipboard.setString(textToShare)
    Alert.alert('Copied successfully', 'Share your score on your social media', [
      {text: 'Play Again', onPress: restart}
    ])
  }

  const restart = () => {
    const choice = Math.floor(Math.random() * NAMES.length)
    setName(NAMES[choice])
    setRows(
      new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
    )
    setCurrentRow(0)
    setCurrentCol(0)
    setGameState('playing')
    setWinVisible(false)
    setAgainVisible(false)
  }

  const onKeyPressed = (key) => {
    if (gameState !== 'playing') {
      return
    }
    const updatedRows = copyArray(rows)

    if (key === CLEAR) {
      const previousCol = currentCol - 1
      if (previousCol >= 0) {
        updatedRows[currentRow][previousCol] = ''
        setRows(updatedRows)
        setCurrentCol(previousCol)
      }
      return
    }

    function delayIncrement() {
      if (currentCol === rows[0].length) {
        setCurrentRow(currentRow + 1)
      }  
      return
    }

    if (key === ENTER) {
      //setModalVisible(true)
      //setTimeout(delayIncrement, 50);
      setShowKeyboard(false)
      if (currentCol === rows[0].length) {
        setCurrentRow(currentRow + 1)
      }  
      return
    }
    
    if (currentCol < rows[0].length) {
      updatedRows[currentRow][currentCol] = key
      setRows(updatedRows)
      setCurrentCol(currentCol + 1)
    }

    return
  }

  const isCellActive = (row, col) => {
    return row === currentRow && col === currentCol
  }

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col]

    if (row >= currentRow) {
      return colors.black
    }
    if (letter === letters[col]) {
      return colors.primary
    }
    if (letters.includes(letter)) {
      return colors.secondary
    }
    return colors.darkgrey
  }

  const getAllLettersWithColor = color => {
    return rows.flatMap((row, i) => 
      row.filter((cell, j) => getCellBGColor(i, j) === color))
  }

  const greenCaps = getAllLettersWithColor(colors.primary)
  const yellowCaps = getAllLettersWithColor(colors.secondary)
  const greyCaps = getAllLettersWithColor(colors.darkgrey)

  const getCellStyle = (i, j)  => [
    styles.cell, 
      {
        borderColor: isCellActive(i, j) ? colors.grey : colors.darkgrey, 
        backgroundColor: getCellBGColor(i, j)
      }
  ]

  
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style="light" /> */}
      <Text style={styles.title}>NAMES GAME</Text>


      {
        showKeyboard ? (
          <SafeAreaView style={styles.box}>
          <ScrollView 
          style={styles.map}
        >
          {rows.map((row, i) => (
            <View 
              key={`row-${i}`} 
              style={styles.row}
              //entering={SlideInLeft.delay(i * 80)} 
            >
              {row.map((letter, j) => (
                <>
                  {i < currentRow && (
                    <View 
                      //entering={FlipInEasyY.delay(600 + j * 120)}
                      key={`cell-color-${i}-${j}`}
                      style={getCellStyle(i, j)}
                    >
                      <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                    </View>
                    )}
                  {i === currentRow && !!letter && (
                    <View 
                      //entering={ZoomIn}
                      key={`cell-active-${i}-${j}`}
                      style={getCellStyle(i, j)}
                    >
                      <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                    </View>
                    )}
                  {!letter && (
                    <View 
                      key={`cell-${i}-${j}`}
                      style={getCellStyle(i, j)}
                    >
                      <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                    </View>
                  )}
                </>
                
              ))}
            </View>
          ))}
          
        </ScrollView>
        <Keyboard 
          onKeyPressed={onKeyPressed} 
          greenCaps={greenCaps} 
          yellowCaps={yellowCaps} 
          greyCaps={greyCaps} 
        />
        <View style={styles.centeredView}>

        <Modal
          animationType="none"
          transparent={true}
          visible={alertVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setAlertVisible(!alertVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.alertView}>
              <Text style={styles.modalText}>{word.toUpperCase()} is not a valid name</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setAlertVisible(!alertVisible)}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        

        <Modal
          animationType="none"
          transparent={true}
          visible={winVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.alertView}>
              <Text style={styles.modalText}>Hurray! You Won!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => restart()}
              >
                <Text style={styles.textStyle}>Play Again</Text>
              </Pressable>
            </View>
          </View>
        </Modal>


        <Modal
          animationType="none"
          transparent={true}
          visible={againVisible}
          // onRequestClose={() => {
          //   Alert.alert("Modal has been closed.");
          //   setAgainVisible(!againVisible);
          // }}
        >
          <View style={styles.centeredView}>
            <View style={styles.alertView}>
              <Text style={styles.modalText}>{name.toUpperCase()}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => restart()}
              >
                <Text style={styles.textStyle}>Play Again</Text>
              </Pressable>
            </View>
          </View>
        </Modal>



      </View> 

        </SafeAreaView>
        ) : (
          <SafeAreaView style={styles.container}></SafeAreaView>
        )
      }
      
      
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get("window").width;

function getMarginTop() {
    if (screenWidth < 700) {
        return -2000
    }
    return 0
}  

function getMarginLeft() {
  if (screenWidth < 700) {
      return -1150
  }
  return 0
}  

const styles = StyleSheet.create({
  box: {
    flex: 1,
    //backgroundColor: 'blue',
    width: 'full',
    height: 'full',
    marginTop: -960
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
    width: 'full',
    height: 'full',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    //alignItems: 'center',
    color: colors.lightgrey,
    //color: 'teal',
    backgroundColor: colors.black,
    width: 2700,
    height: 1000,
    fontSize: 45,
    fontWeight: 'bold',
    letterSpacing: 7,
    paddingTop: 40,
    marginBottom: 80
  },
  
  map: {
    alignSelf: 'stretch',
    marginVertical: 20,
  },
  row: {
    alignSelf: 'stretch', 
    flexDirection: 'row',
    justifyContent: 'center'
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    aspectRatio: 1,
    flex: 1, 
    margin: 3,
    maxWidth: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
    fontSize: 28
  },



  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: 400,
    height: 650,
    marginTop: 40,
    backgroundColor: colors.black,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
    //shadowOpacity: 0.25,
    //shadowRadius: 4,
    //elevation: 5
  },
  button: {
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
    marginBottom: 40
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 25
  },
  modalText: {
    fontSize: 30,
    marginBottom: 30,
    textAlign: "center"
  },


  alertView: {
    marginTop: getMarginTop(),
    marginLeft: getMarginLeft(),
    width: 500,
    height: 200,
    backgroundColor: colors.lightgrey,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },


});
