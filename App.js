import React from "react";
import { Text, Modal ,View, StyleSheet,Pressable, TextInput,Alert  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';


export function Button(props) {
  const { onPress, title = 'Save' } = props;
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export function ButtonSave(props) {
  const { onPress, title = 'Save' } = props;
  return (
    <Pressable style={styles.buttonSave} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export function ControlButtonLeft(props) {
  const { onPress, title = 'Save' } = props;
  return (
    <Pressable style={styles.controlButtonLeft} onPress={onPress}>
      <Text style={styles.textButton}>{title}</Text>
    </Pressable>
  );
}

export function ControlButtonRight(props) {
  const { onPress, title = 'Save' } = props;
  return (
    <Pressable style={styles.controlButtonRight} onPress={onPress}>
      <Text style={styles.textButton}>{title}</Text>
    </Pressable>
  );
}

const sendPresData = (usr,sisData,diasData,setModalText,setModalVisible) => {  
  
  return fetch('http://192.168.0.125:8090/user', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      presionarterialdiastolica:diasData,
      presionarterialsistolica:sisData,
      paciente:usr
    })
  }).then((response) => {
    if (sisData < 120 && diasData < 80){
      setModalText("Datos Enviados, valores de presión arterial en rangos normales.");
    } else if (sisData >= 120 || diasData >= 80){
      setModalText("Datos Enviados, valores de presión arterial elevados, se recomienda contactar con UISALUD.");
    }
    setModalVisible(true);
  });
};

const sendGlucosaData = (usr,glucosaLvl) => {
  return fetch('http://192.168.0.125:8090/user', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      glucosa: glucosaLvl,
      paciente: usr
    })
  });
};

const sendPesoCinturaData = (usr,peso,cintura) => {
  return fetch('http://192.168.0.125:8090/user', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      perimetro:cintura,
      peso:peso,
      usuario:usr
    })
  });
};



const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [
    /* your linking prefixes */
  ],
  config: {
    screens: {
      Home: {
        path: 'user/:usr',
        parse: {
          usr: (usr) => `${usr}`,
        },
        stringify: {
          usr: (usr) => usr.replace(/^user-/, ''),
        },
      },
      HTA: {
        path: 'HTA/user/:usr',
        parse: {
          usr: (usr) => `${usr}`,
        },
        stringify: {
          usr: (usr) => usr.replace(/^user-/, ''),
        },
      },
    },
  },
};

function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="HTA" component={HTAScreen} />
        <Stack.Screen name="Glucosa" component={GlucosaScreen} />
        <Stack.Screen name="PesoCintura" component={PesoCinturaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  const route = useRoute();
  let usuario = route.params.usr;
  //console.log(usr);
  //let usuario = 1;
  return (
    <View style={styles.container}>     
        <Button title="PRESIÓN ARTERIAL" onPress={() => navigation.navigate('HTA',{usr:usuario})}/>
        <Button title="NIVEL GLUCOSA" onPress={() => navigation.navigate('Glucosa',{usr:usuario})}/>
        <Button title="PESO Y CINTURA" onPress={() => navigation.navigate('PesoCintura',{usr:usuario})}/>  
      </View>    
  );
}


function HTAScreen({navigation}) {  
  const route = useRoute();
  let usr = route.params.usr;
  let [presionSis, setPresionSis] = React.useState(110);
  let [presionDias, setPresionDias] = React.useState(70);
  let [modalVisible, setModalVisible] = React.useState(false);
  let [modalText,setModalText] = React.useState("Enviado");
  return (
    <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{modalText}</Text>
              <Pressable
                    style={[styles.buttonModal]}
                    onPress={() => navigation.navigate('Home',{usr:usr})}
              >
                  <Text style={styles.text}>Cerrar</Text>
              </Pressable>
            </View>  
          </View>                
        </Modal>    
        <Text style={styles.title}>PRESIÓN SISTÓLICA</Text>
        <TextInput
          style={styles.input}
          value={presionSis}
          keyboardType="numeric"
          onChange={e => setPresionSis(presionSis=parseInt(e.target.value))}
        /><Text style={styles.suffy}>mm/Hg</Text>
        <View style={styles.fixToText}>
            <ControlButtonLeft title="-" onPress={() => setPresionSis(presionSis-1)}/>
            <ControlButtonRight title="+" onPress={() => setPresionSis(presionSis+1)}/>  
        </View>
        <Text style={styles.title}>PRESIÓN DIASTÓLICA</Text>
        <TextInput
          style={styles.input}
          value={presionDias}
          keyboardType="numeric"
          onChange={e => setPresionDias(presionDias=parseInt(e.target.value))}
        /><Text style={styles.suffy}>mm/Hg</Text>
        <View style={styles.fixToText}>
            <ControlButtonLeft title="-" onPress={() => setPresionDias(presionDias-1)}/>
            <ControlButtonRight title="+" onPress={() => setPresionDias(presionDias+1)}/>  
        </View>
        <ButtonSave title="GUARDAR" onPress={() => sendPresData(usr,presionSis,presionDias,setModalText,setModalVisible)}/>      
    </View>     
  );
}


function GlucosaScreen() {
  const route = useRoute();
  let usr = route.params.usr;
  let [glucosaLvl, setGlucosaLvl] = React.useState(130);
  return (
    <View style={styles.container}>     
        <Text style={styles.title}>NIVEL DE GLUCOSA</Text>
        <TextInput
          style={styles.input}
          value={glucosaLvl}
          keyboardType="numeric"
          onChange={e => setGlucosaLvl(glucosaLvl=parseInt(e.target.value))}
        /><Text style={styles.suffy}>mg/dl</Text>
        <View style={styles.fixToText}>
            <ControlButtonLeft title="-" onPress={() => setGlucosaLvl(glucosaLvl-1)}/>
            <ControlButtonRight title="+" onPress={() => setGlucosaLvl(glucosaLvl+1)}/>  
        </View>
        <ButtonSave title="GUARDAR" onPress={() => sendGlucosaData(usr,glucosaLvl)}/>
    </View>    
  );
}

function PesoCinturaScreen() {
  const route = useRoute();
  let usr = route.params.usr;
  let [peso, setPeso] = React.useState(70);
  let [cintura, setCintura] = React.useState(60);

  return (
    <View style={styles.container}>     
        <Text style={styles.title}>PESO</Text>
        <TextInput
          style={styles.input}
          value={peso}
          keyboardType="numeric"
          onChange={e => setPeso(peso=parseInt(e.target.value))}
        /><Text style={styles.suffy}>kg</Text>
        <View style={styles.fixToText}>
            <ControlButtonLeft title="-" onPress={() => setPeso(peso-1)}/>
            <ControlButtonRight title="+" onPress={() => setPeso(peso+1)}/>  
        </View>
        <Text style={styles.title}>MEDIDA CINTURA</Text>
        <TextInput
          style={styles.input}
          value={cintura}
          keyboardType="numeric"
          onChange={e => setCintura(cintura=parseInt(e.target.value))}
        /><Text style={styles.suffy}>cm</Text>
        <View style={styles.fixToText}>
            <ControlButtonLeft title="-" onPress={() => setCintura(cintura-1)}/>
            <ControlButtonRight title="+" onPress={() => setCintura(cintura+1)}/>  
        </View>
        <ButtonSave title="GUARDAR" onPress={() => sendPesoCinturaData(usr,peso,cintura)}/>
    </View>    
  );
}




const styles = StyleSheet.create({
    container: {flex: 1, justifyContent:"center",alignItems:"center"},
    title: { 
      fontSize:30,
      marginTop:20,
    },
    modalText:{
      fontSize:30,
      marginTop:10,
      marginBottom:10,
      textAlign:'center',
    },
    buttonModal: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 2,
      paddingHorizontal: 2,
      width:"60%",
      height:60,
      marginBottom:"50px",
      borderRadius: 4,
      elevation: 3,
      backgroundColor: '#9ACD32',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      width:"80%",
      height:"80px",
      marginBottom:"50px",
      borderRadius: 4,
      elevation: 3,
      backgroundColor: '#9ACD32',
    },
    buttonSave: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      width:"80%",
      height:"80px",
      marginTop:"30px",
      marginBottom:"50px",
      borderRadius: 4,
      elevation: 3,
      backgroundColor: '#FFC300',
    },
    controlButtonLeft: {
      alignItems: 'center',
      justifyContent: 'center',
      width:"120px",
      marginRight:"15px",
      height:"60px",
      borderRadius: 4,
      backgroundColor: '#9ACD32',
    },
    controlButtonRight: {
      alignItems: 'center',
      justifyContent: 'center',
      width:"120px",
      marginRight:"15px",
      marginLeft:"15px",
      height:"60px",
      borderRadius: 4,
      backgroundColor: '#9ACD32',
    },    
    textButton: { 
      fontSize:30,
      color:'white',
    },
    suffy:{
      color:'black',
      fontSize:20,
      marginBottom:"20px",
    },
    fixToText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    text: {
      fontSize: 22,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    input: {
      height: 70,
      width:"50%",
      textAlign:"center",
      fontSize:60,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 15
    },
    modalView: {
      margin: 5,
      width:"80%",
      backgroundColor: "white",
      borderRadius: 20,
      padding: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4
    },
});

export default App;
