import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { recordAccess } from '../../config/recordAccess';

type Biology = {
    id: string;
    commonName: string;
    scientificName: string;
    specieType: string;
    description: string;
    habitat: string;
    imageUrl?: string; // Optional to handle missing image
    discoveredAt: string;
    averageLifeSpan: string;
    isExtinct: boolean;
    status: string;
};

type Props = {
    route: {
        params: {
            biology?: Biology; // Optional to handle missing biology
        };
    };
};

export default function BiologyDetail({ route }: Props) {
    const { biology } = route.params;
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function logAccess() {
            try {
                if (biology?.id) {
                    await recordAccess(biology.id);
                }
            } catch (err) {
                setError('Failed to record access');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        logAccess();
    }, [biology?.id]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!biology) {
        return (
            <View style={styles.container}>
                <Text>Error: Biology data not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>{biology.commonName}</Text>
                    <Text style={styles.scientificName}>{biology.scientificName}</Text>
                </View>
                <Image
                    source={{ uri: biology.imageUrl || 'https://example.com/placeholder-image.jpg' }}
                    style={styles.image}
                    resizeMode="cover"
                    accessible
                    accessibilityLabel={biology.commonName}
                />
                <View style={styles.infoContainer}>
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
                    <View style={styles.section}>
                        <Text style={styles.label}>Description</Text>
                        <Text style={styles.text}>{biology.description}</Text>
                    </View>
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
        backgroundColor: '#f3f4f6',
    },
    card: {
        margin: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#065f46',
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
        color: '#e5e7eb',
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
        width: '48%',
        marginBottom: 12,
    },
    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#56dd12',
        marginBottom: 4,
    },
    text: {
        fontSize: 16,
        color: '#4b5563',
        lineHeight: 24,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        margin: 10,
    },
});