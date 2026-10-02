import React, { useEffect } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import Svg, { Polygon } from 'react-native-svg';

import { useRouter } from 'expo-router';


export default function SplashScreen() {

  const router = useRouter();


  /* =========================
     AUTOMATIC NAVIGATION
     ========================= */

  useEffect(() => {

    const timer = setTimeout(() => {

  router.replace('/onboarding');

    }, 5000);


    return () => clearTimeout(timer);

  }, []);


  return (

    <View style={styles.screen}>

      <LinearGradient
        colors={['#F1F3F5', '#858A8E']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >

        {/* =========================
            COMPLETE LOGO
            ========================= */}

        <View style={styles.logo}>

          {/* Clipboard */}

          <View style={styles.clipboard}>

            {/* Left vertical line */}

            <View style={styles.leftLine} />


            {/* Top horizontal line */}

            <View style={styles.topLine} />


            {/* Right upper line */}

            <View style={styles.rightLine} />


            {/* Bottom left line */}

            <View style={styles.bottomLine} />


            {/* Top Clip */}

            <View style={styles.clip}>

              <View style={styles.clipInside} />

            </View>

          </View>


          {/* TaskMaster */}

          <Text style={styles.taskMaster}>
            TaskMaster
          </Text>


          {/* Yellow Star */}

          <View style={styles.star}>

            <Svg
              width="92"
              height="92"
              viewBox="0 0 100 100"
            >

              <Polygon
                points="
                  50,5
                  61,38
                  96,38
                  68,58
                  79,93
                  50,72
                  21,93
                  32,58
                  4,38
                  39,38
                "
                fill="#F4D900"
              />

            </Svg>

          </View>

        </View>


        {/* =========================
            TAGLINE
            ========================= */}

        <Text style={styles.tagline}>
          Organize your day, conquer your goals.
        </Text>


      </LinearGradient>

    </View>

  );

}


const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },


  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  /* =========================
     COMPLETE LOGO
     ========================= */

  logo: {
    width: 175,
    height: 185,
    position: 'relative',
  },


  /* =========================
     CLIPBOARD
     ========================= */

  clipboard: {
    position: 'absolute',

    left: 10,
    top: 18,

    width: 145,
    height: 150,
  },


  /* Left side */

  leftLine: {
    position: 'absolute',

    left: 0,
    top: 12,

    width: 10,
    height: 150,

    backgroundColor: '#000000',

    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },


  /* Top */

  topLine: {
    position: 'absolute',

    left: 8,
    top: 12,

    width: 127,
    height: 10,

    backgroundColor: '#000000',
  },


  /* Right side */

  rightLine: {
    position: 'absolute',

    right: 0,
    top: 12,

    width: 10,
    height: 38,

    backgroundColor: '#000000',

    borderTopRightRadius: 10,
  },


  /* Bottom left */

  bottomLine: {
    position: 'absolute',

    left: 8,
    bottom: -12,

    width: 62,
    height: 10,

    backgroundColor: '#000000',
  },


  /* =========================
     TOP CLIP
     ========================= */

  clip: {
    position: 'absolute',

    left: 35,
    top: -9,

    width: 80,
    height: 54,

    backgroundColor: '#000000',

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 5,
  },


  clipInside: {
    width: 49,
    height: 26,

    backgroundColor: '#C9CDD0',
  },


  /* =========================
     TASKMASTER
     ========================= */

  taskMaster: {
    position: 'absolute',

    top: 66,
    left: 90,

    fontSize: 20,

    fontWeight: '700',

    color: '#111111',

    zIndex: 10,
  },


  /* =========================
     STAR
     ========================= */

  star: {
    position: 'absolute',

    right: -8,
    bottom: 0,

    width: 92,
    height: 80,

    zIndex: 10,
  },


  /* =========================
     TAGLINE
     ========================= */

  tagline: {
    marginTop: 24,

    fontSize: 14,

    fontWeight: '400',

    color: '#111111',

    textAlign: 'center',
  },

});