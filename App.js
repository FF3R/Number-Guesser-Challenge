import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, ScrollView, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import Intento from './components/Intento'; 

export default function App() {
  const [intento, setIntento] = useState(null);
  const [intentoItems, setIntentoItems] = useState([]);
  const [intentoContador, setIntentoContador] = useState(0);
  const [winnerModalVisible, setWinnerModalVisible] = useState(false);
  const [loserModalVisible, setLoserModalVisible] = useState(false);
  const [numeroGenerado, setNumeroGenerado] = useState(0);

  useEffect(() => {
    const numeroRandom = generarNumeroRandom();
    setNumeroGenerado(numeroRandom);
    console.log("Numero Generado: ", numeroRandom);
  }, []);

  const generarNumeroRandom = () => {
    return Math.floor(Math.random() * 9000) + 1000; // Genera un numero random de 4 digitos
  };

  const revisarNumero = (numinsert, numrand) => {
    const intentoArray = numinsert.toString().split('');
    const randArray = numrand.toString().split('');
    let posCorecta = 0;
    let numCorreto = 0;

    const usedIndices = new Set();

   
    intentoArray.forEach((digito, index) => {
      if (digito === randArray[index]) {
        posCorecta++;
        usedIndices.add(index);
      }
    });


    intentoArray.forEach((digito, index) => {
      if (digito !== randArray[index] && randArray.includes(digito)) {
      
        const targetIndex = randArray.findIndex((d, i) => d === digito && !usedIndices.has(i));
        if (targetIndex !== -1) {
          numCorreto++;
          usedIndices.add(targetIndex);
        }
      }
    });

    const numIncorrecto = intentoArray.length - posCorecta - numCorreto;

    return { posCorecta, numCorreto, numIncorrecto };
  };


  const handleAddIntento = () => {
    Keyboard.dismiss();
    const numberValor = parseInt(intento);
    const { posCorecta, numCorreto, numIncorrecto } = revisarNumero(numberValor, numeroGenerado);
    setIntentoItems([...intentoItems, { value: numberValor, posCorecta, numCorreto, numIncorrecto }]);
    setIntento(null);
    setIntentoContador(intentoContador + 1);

    if (numberValor === numeroGenerado) {
      setWinnerModalVisible(true);
    } else if (intentoContador >= 9) {
      setLoserModalVisible(true);
    }
  };

  const reiniciarJuego = () => {
    setNumeroGenerado(generarNumeroRandom());
    setIntentoItems([]);
    setIntentoContador(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.taskWrapper}>
        <Text style={styles.sectionTitle}>Adivine el número de 4 digitos!</Text>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.items}>
            {intentoItems.map((item, index) => (
              <TouchableOpacity key={index}>
                <Intento
                  text={item.value}
                  index={index}
                  bien={item.posCorecta}
                  regular={item.numCorreto}
                  mal={item.numIncorrecto}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios'? 'padding' : 'height'} style={styles.writeTaskWrapper}>
        <TextInput
          style={styles.input}
          placeholder={'Ingrese un número'}
          value={intento}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, '');
            const numberValor = parseInt(numericValue);
            if (!isNaN(numberValor)) {
              setIntento(numberValor.toString());
            }
          }}
        />
        <TouchableOpacity
          onPress={() => {
            if (intentoContador < 10 &&!isNaN(intento) && intento!== null && intento.length === 4) {
              handleAddIntento();
            } else if(intentoContador > 10) {
              (true);
              reiniciarJuego();
            }
          }}
        >
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={winnerModalVisible}
        onRequestClose={() => {
          setWinnerModalVisible(!winnerModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¡Ganaste! El número era: {numeroGenerado} </Text>
            <TouchableOpacity
              style={{...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                reiniciarJuego();
                setWinnerModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={loserModalVisible}
        onRequestClose={() => {
          setLoserModalVisible(!loserModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>¡Prediste! El número era: {numeroGenerado}</Text>
            <TouchableOpacity
              style={{...styles.openButton, backgroundColor: "#f44336" }}
              onPress={() => {
                reiniciarJuego();
                setLoserModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Reiniciar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  taskWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: 250,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
  scrollView: {
    marginTop: 30,
    marginBottom: 180,
    borderRadius: 60,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
  openButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
});
