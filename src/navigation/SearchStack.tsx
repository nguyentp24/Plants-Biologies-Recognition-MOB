import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BiologySearch from '../screens/main/LessonSearch';
import BiologyDetail from '../screens/search/BiologyDetails';

// Định nghĩa kiểu cho SearchStack, tái sử dụng RootStackParamList từ BiologySearch
export type SearchStackParamList = {
  BiologySearch: undefined;
  BiologyDetail: { biology: Biology };
};

// Định nghĩa kiểu Biology để đảm bảo nhất quán
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

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true, // Bật header
        headerStyle: {
          backgroundColor: '#f8f8f8', // Màu nền header, đồng bộ với BiologySearch
        },
        headerTintColor: '#4CAF50', // Màu của nút Back và tiêu đề
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="BiologySearch"
        component={BiologySearch}
        options={{
          headerTitle: 'Biology Search', // Tiêu đề cho BiologySearch
        }}
      />
      <Stack.Screen
        name="BiologyDetail"
        component={BiologyDetail}
        options={({ route }) => ({
          headerTitle: route.params.biology.commonName, // Tiêu đề động dựa trên commonName
        })}
      />
    </Stack.Navigator>
  );
}