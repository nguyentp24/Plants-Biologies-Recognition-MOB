import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SearchStackParamList } from '../../navigation/SearchStack';

type Biology = {
  id: string;
  commonName: string;
  scientificName: string;
  specieType: string;
  description: string;
  habitat: string;
  imageUrl: string;
  discoveredAt: string;
  averageLifeSpan: string;
  isExtinct: boolean;
  status: string;
};

export default function BiologyDetail() {
  const route = useRoute<RouteProp<SearchStackParamList, 'BiologyDetail'>>();
  const { biology } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Header with Common Name and Scientific Name */}
        <View >
          <Text style={styles.title}>{biology.commonName}</Text>
          <Text style={styles.scientificName}>{biology.scientificName}</Text>
        </View>

        {/* Image */}
        <Image
          source={{ uri: biology.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Info Section */}
        <View style={styles.infoContainer}>
          {/* Grid-like layout for key info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.text}>{biology.specieType}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.text}>{biology.status}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Discovered</Text>
              <Text style={styles.text}>{biology.discoveredAt}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Extinct</Text>
              <Text style={styles.text}>{biology.isExtinct ? 'Yes' : 'No'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Life Span</Text>
              <Text style={styles.text}>{biology.averageLifeSpan}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.text}>{biology.description}</Text>
          </View>

          {/* Habitat */}
          <View style={styles.section}>
            <Text style={styles.label}>Habitat</Text>
            <Text style={styles.text}>{biology.habitat}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Light gray background for a modern look
  },
  card: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // For Android shadow
    overflow: 'hidden',
  },
  Ρheader: {
    backgroundColor: '#065f46', // Dark green for header
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scientificName: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#e5e7eb', // Light gray for contrast
    marginTop: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    width: '48%', // Two columns with a small gap
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151', // Dark gray for labels
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: '#4b5563', // Slightly lighter gray for text
    lineHeight: 24,
  },
});