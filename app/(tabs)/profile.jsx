import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { FlatList } from "react-native";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { getUserPosts } from "../../lib/appwrite";
import { Image } from "react-native";
import icons from "../../constants/icons";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";

const Profile = () => {
  const { user,setUser,setIsLoggedIn} = useGlobalContext();

  const { data: posts } = useAppwrite(() =>
  getUserPosts(user.$id));
  console.log(user);

  const [refreshing, setRefreshing] = useState(false);
  
  const logout=async()=>{
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/sign-in')
  }

 
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
            className="w-full items-end mb-10"
            onPress={logout}>
              <Image
                source={icons.logout}
                className="w-16 h-16 "
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View
            className="-16 h-16 border border-secondary rounded-lg justify-center items-center">
            <Image 
              source={{uri:user.avatar}}
              className="w-[90%] h-[90%] rounded-lg"
              resizeMode="cover"
              />
              <InfoBox
              title={user?.username}
              containerStyle="mt-5"
              titleStyles="text-lg"
              >
                <InfoBox
              title={posts.length || 0}
              subtitle="Posts"
              containerStyle="mr-10"
              titleStyles="text-xl"
              ></InfoBox>
              <InfoBox
              title="1.2k"
              subtitle="Followers"
              
              titleStyles="text-xl"
              ></InfoBox>

              </InfoBox>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="no videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
