import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Recognition() {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [info, setInfo] = useState(null);
     const [error, setError] = useState('');

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('You need to grant image access');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled && result.assets?.length > 0) {
            setImage(result.assets[0]);
            setName('');
            setInfo(null);
        }
    };

    const recognize = async () => {
        if (!image) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('image', {
            uri: image.uri,
            name: 'image.jpg',
            type: 'image/jpeg',
        });

        try {
           const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                setError('Token not found. Please login again.');
                return;
            }

            console.log('Token:', token);  // Check token in console
            const res = await fetch('https://bilogieseducationapp.onrender.com/api/Predict/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                body: formData,
            });

            const result = await res.json();
            const label = result?.[0]?.name;
            setName(label);

            console.log(label);

            // Fetch biology info
           const res2 = await fetch(`https://plants-biologies.onrender.com/api/Biologies/search?input=${encodeURIComponent(label)}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
    },
});            const data = await res2.json();
            console.log("Search result:", data);
            if (Array.isArray(data) && data.length > 0) setInfo(data[0]);
            else {
                Alert.alert("Không tìm thấy thông tin sinh vật")
                setInfo(null);}
        } catch (err) {
            Alert.alert('Error', 'Not recognized!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Biology Recognition App</Text>
            <Text style={styles.subtitle}>Identify and learn about Biologies</Text>

            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>

            {image && (
                <View style={styles.imageBox}>
                    <Image source={{ uri: image.uri }} style={styles.image} />
                    <Text style={styles.size}>Size: {image.width} x {image.height}</Text>
                </View>
            )}

            {image && (
                <TouchableOpacity style={styles.detectButton} onPress={recognize}>

                    <Text style={styles.buttonText}>Recognize Biology</Text>

                </TouchableOpacity>
            )}

            {loading && <ActivityIndicator style={{ marginTop: 10 }} size="large" color="#27ae60" />}

            {name && (
                <View style={styles.resultBox}>
                    <Text style={styles.success}>Succesfully</Text>
                    <Text style={styles.label}>Result:</Text>
                    <Text style={styles.name}> {name}</Text>

                </View>
            )}

            {info && (
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Biology details</Text>
                    <Text style={styles.item}><Text style={styles.bold}>🐾 Common name:</Text> {info.commonName}</Text>
                    <Text style={styles.item}><Text style={styles.bold}>🔬 Scientific name:</Text> {info.scientificName}</Text>
                    <Text style={styles.item}><Text style={styles.bold}>🏷️ Species:</Text> {info.specieType}</Text>
                    <Text style={styles.item}><Text style={styles.bold}>📝 Describe:</Text> {info.description}</Text>
                    <Text style={styles.item}><Text style={styles.bold}>🌍 Môi trường sống:</Text> {info.habitat}</Text>
                    <Text style={styles.item}><Text style={styles.bold}>⏰ Tuổi thọ:</Text> {info.averageLifeSpan}</Text>
                    <Text style={styles.item}><Text style={styles.bold}>📅 Được phát hiện:</Text> {info.discoveredAt}</Text>
                    <Text style={[styles.status, { backgroundColor: info.isExtinct ? '#e74c3c' : '#047857' }]}>
                        {info.isExtinct ? '⚠️ Tuyệt chủng' : '✅ Còn tồn tại'}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f4f6f8' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#666' },
    button: { backgroundColor: '#047857', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
    detectButton: { backgroundColor: '#047857', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    imageBox: { alignItems: 'center', marginVertical: 10 },
    image: { width: 250, height: 250, borderRadius: 10 },
    size: { fontSize: 12, color: '#888', marginTop: 5 },
    resultBox: { backgroundColor: '#e0f7ea', padding: 15, borderRadius: 10, marginTop: 15 },
    success: { fontSize: 16, color: '#2ecc71', fontWeight: 'bold' },
    label: { marginTop: 8, fontSize: 14 },
    name: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginTop: 20, elevation: 2 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    item: { fontSize: 14, marginBottom: 6, lineHeight: 20 },
    bold: { fontWeight: 'bold' },
    status: { marginTop: 10, padding: 8, color: 'white', textAlign: 'center', borderRadius: 8, fontWeight: 'bold' },
});
