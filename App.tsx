import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  LogBox,
  Alert,
  ImageBackground,
} from 'react-native';

import Permissions from 'react-native-permissions';
import PDFScanner from '@woonivers/react-native-document-scanner';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default function App() {
  const pdfScannerElement = useRef(null);
  const [data, setData] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [firstImg, setFirstImg] = useState(null);

  useEffect(() => {
    async function requestCamera() {
      const result = await Permissions.request(
        Platform.OS === 'android'
          ? 'android.permission.CAMERA'
          : 'ios.permission.CAMERA',
      );
      if (result === 'granted') setAllowed(true);
    }
    requestCamera();
  }, []);

  function handleOnPressRetry() {
    // setData(null);
    setFirstImg(null);
  }
  function handleOnPress() {
    pdfScannerElement.current.capture();
  }
  if (!allowed) {
    console.log('You must accept camera permission');
    return (
      <View style={styles.permissions}>
        <Text>You must accept camera permission</Text>
      </View>
    );
  }
  LogBox.ignoreLogs(['EventEmitter.removeListener']);
  console.log('hello ', data);

  if (firstImg) {
    return (
      <React.Fragment>
        <Image source={{uri: firstImg}} style={styles.preview} />
        <View style={styles.bottomNav}>
          <Icon.Button
            name="camera-retake-outline"
            backgroundColor="#3b98"
            onPress={handleOnPressRetry}>
            Retry
          </Icon.Button>
          <Icon.Button
            name="crop"
            backgroundColor="#3b98"
            onPress={OnCropPress}>
            Crop
          </Icon.Button>
        </View>
      </React.Fragment>
    );
  }

  function OnCropPress() {
    ImagePicker.openCropper({
      path: firstImg,
      // compressImageMaxWidth	: 300,
      // height: 400,
    }).then(image => {
      // setData(image);
      setFirstImg(null);
      setFirstImg(image.path);
    });
  }

  const onHandle = img => {
    setFirstImg(img.croppedImage);
  };

  return (
    <React.Fragment>
      <PDFScanner
        ref={pdfScannerElement}
        style={styles.scanner}
        onPictureTaken={onHandle}
        overlayColor="rgba(255,130,0, 0.7)"
        enableTorch={false}
        quality={0.5}
        detectionCountBeforeCapture={5}
        detectionRefreshRateInMS={50}
        onRectangleDetect={({stableCounter, lastDetectionType}) =>
          setData({stableCounter, lastDetectionType})
        }
      />
      <TouchableOpacity onPress={handleOnPress} style={styles.button}>
        <Text style={styles.buttonText}>Take picture</Text>
      </TouchableOpacity>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  crop: {
    marginTop: '50%',
    display: 'flex',
    alignItems: 'center',
  },
  scanner: {
    flex: 1,
    aspectRatio: undefined,
  },
  button: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 32,
  },
  buttonText: {
    backgroundColor: 'rgba(245, 252, 255, 0.7)',
    fontSize: 32,
  },
  preview: {
    // flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    resizeMode: 'contain',
  },
  permissions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomNav: {
    position: 'absolute',
    width: '100%',
    bottom: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
