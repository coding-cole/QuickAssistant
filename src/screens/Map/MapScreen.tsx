import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, Theme } from '@theme';
import { Typography } from '@components/common';
import { LocationSearchBar, SavedPlaceCard, LocationListItem } from '@components/map';
import { HomeStackParamList } from '@app-types/navigation.types';
import { Location, SavedPlace } from '@app-types/map.types';

type MapNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const { width } = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<MapNavigationProp>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Location[]>([]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    setSearchResults([]);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  }, []);

  const handleLocationSelect = useCallback(
    (location: Location | SavedPlace) => {
      navigation.navigate('Chat', {
        initialQuery: `Take me to ${location.name}`,
      });
    },
    [navigation]
  );

  const handleSavedPlacePress = useCallback(
    (place: SavedPlace) => {
      navigation.navigate('PriceComparison', {
        destination: place.address,
      });
    },
    [navigation]
  );

  const renderLocationItem = useCallback(
    ({ item }: { item: Location }) => (
      <LocationListItem location={item} onPress={() => handleLocationSelect(item)} />
    ),
    [handleLocationSelect]
  );

  const renderSearchResults = () => (
    <View style={styles.searchResultsContainer}>
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : searchQuery.length > 1 ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={48} color={theme.colors.textDisabled} />
          <Typography variant="body" color="secondary" style={styles.noResultsText}>
            No locations found for "{searchQuery}"
          </Typography>
        </View>
      ) : (
        <>
          <Typography variant="bodySmall" color="secondary" style={styles.sectionLabel}>
            Recent Searches
          </Typography>
          <FlatList
            data={[]}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );

  const renderMapPlaceholder = () => (
    <View style={styles.mapPlaceholder}>
      <View style={styles.mapOverlay}>
        <Ionicons name="map" size={64} color={theme.colors.primary} />
        <Typography variant="body" color="secondary" style={styles.mapPlaceholderText}>
          Interactive map coming soon
        </Typography>
        <Typography variant="caption" color="secondary">
          Search for a destination above
        </Typography>
      </View>
      {/* Simulated map grid */}
      <View style={styles.mapGrid}>
        {Array.from({ length: 12 }).map((_, index) => (
          <View key={index} style={styles.mapGridCell} />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <LocationSearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFocus={handleSearchFocus}
          onClear={handleClearSearch}
          placeholder="Where would you like to go?"
        />
        {isSearchFocused && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleClearSearch}>
            <Typography variant="bodySmall" style={styles.cancelText}>
              Cancel
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {isSearchFocused ? (
        renderSearchResults()
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Saved Places */}
          <View style={styles.section}>
            <Typography variant="bodySmall" color="secondary" style={styles.sectionLabel}>
              Saved Places
            </Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.savedPlacesContainer}
            >
              {([] as SavedPlace[]).map((place) => (
                <SavedPlaceCard
                  key={place.id}
                  place={place}
                  onPress={() => handleSavedPlacePress(place)}
                  compact
                />
              ))}
              <TouchableOpacity style={styles.addPlaceButton}>
                <Ionicons name="add" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Map Placeholder */}
          {renderMapPlaceholder()}

          {/* Popular Destinations */}
          <View style={styles.section}>
            <Typography variant="bodySmall" color="secondary" style={styles.sectionLabel}>
              Popular Destinations
            </Typography>
            {([] as Location[]).map((location) => (
              <LocationListItem
                key={location.id}
                location={location}
                onPress={() => handleLocationSelect(location)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    cancelButton: {
      marginLeft: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    cancelText: {
      color: theme.colors.primary,
    },
    searchResultsContainer: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
    },
    noResultsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl,
    },
    noResultsText: {
      marginTop: theme.spacing.md,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xxl,
    },
    section: {
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    sectionLabel: {
      marginBottom: theme.spacing.sm,
      fontWeight: theme.fontWeight.semiBold,
    },
    savedPlacesContainer: {
      paddingVertical: theme.spacing.xs,
    },
    addPlaceButton: {
      width: 80,
      height: 76,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
    },
    mapPlaceholder: {
      height: 200,
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.card,
      overflow: 'hidden',
      position: 'relative',
    },
    mapOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primaryLight + '20',
      zIndex: 1,
    },
    mapPlaceholderText: {
      marginTop: theme.spacing.sm,
    },
    mapGrid: {
      ...StyleSheet.absoluteFillObject,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    mapGridCell: {
      width: width / 4,
      height: 50,
      borderWidth: 0.5,
      borderColor: theme.colors.border,
    },
  });

export default MapScreen;
