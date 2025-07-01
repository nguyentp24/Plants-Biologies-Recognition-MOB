import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type PlantInfo = {
    uri: string;
    name: string;
    description: string;
};

export default function Recognition() {
    const [images, setImages] = useState<PlantInfo[]>([]);
    const [selectedPlant, setSelectedPlant] = useState<PlantInfo | null>(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission Denied: We need permission to access your gallery.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const newImage = {
                uri: result.assets[0].uri,
                name: 'Fern',
                description:
                    'The Fern is a member of a group of about 12,000 species of vascular plants that reproduce via spores and have neither seeds nor flowers...',
            };

            setImages((prevImages) => [...prevImages, newImage]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Plant Recognition</Text>
            <Text style={styles.subtitle}>Upload plant images to identify them.</Text>

            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>

            <ScrollView style={{ width: '100%', marginTop: 20 }}>
                {images.map((img, index) => (
                    <View key={index} style={styles.row}>
                        <Image source={{ uri: img.uri }} style={styles.thumbnail} />
                        <View style={styles.infoBox}>
                            <Text style={styles.plantText}>This is {img.name},....</Text>
                            <TouchableOpacity onPress={() => setSelectedPlant(img)}>
                                <Text style={styles.moreInfo}>Click Here to get more information</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <Modal visible={!!selectedPlant} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedPlant && (
                            <>
                                <Image source={{ uri: selectedPlant.uri }} style={styles.modalImage} />
                                <Text style={styles.modalTitle}>{selectedPlant.name}</Text>
                                <Text style={styles.modalSubtitle}>Pteridophyt</Text>
                                <Text style={styles.modalText}>{selectedPlant.description}</Text>
                            </>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedPlant(null)}>
                            <Text style={{ color: '#fff' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: 'black' },
    title: { fontSize: 24, textAlign: 'center', fontWeight: 'bold', marginBottom: 2, padding: 12, color: 'white' },
    subtitle: { fontSize: 14, color: '#aaa', textAlign: 'center', marginBottom: 10 },
    button: { backgroundColor: '#4CAF50', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1c1c1c', borderRadius: 12, padding: 10, marginBottom: 15, marginHorizontal: 10 },
    thumbnail: { width: 120, height: 90, borderRadius: 8, marginRight: 12 },
    infoBox: { flex: 1, justifyContent: 'center' },
    plantText: { color: '#ccc', fontSize: 14, marginBottom: 4 },
    moreInfo: { color: 'orange', fontWeight: 'bold' },
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#fff', borderRadius: 15, padding: 20, alignItems: 'center' },
    modalImage: { width: 200, height: 150, borderRadius: 10, marginBottom: 10 },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    modalSubtitle: { fontSize: 16, color: 'gray', marginBottom: 8 },
    modalText: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
    closeButton: { backgroundColor: 'orange', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
});
